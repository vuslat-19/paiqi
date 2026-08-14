import cloudbase from 'https://esm.sh/@cloudbase/js-sdk@3.7.1?bundle';

const env = 'vuslat-19-d8gqn7f0k9161956c';
const projectId = 'brand-site-3';
const storageKey = 'yanshou-db';
let syncing = false;

async function call(action, workspace) {
  const result = await window.teamWorkspaceApp.callFunction({
    name: 'team_workspace',
    data: { action, projectId, workspace }
  });
  return result.result || result;
}

function itemKey(item) {
  return `${item?.id ?? ''}::${item?.title ?? ''}`;
}

// The bundled walkthrough is present on a first visit.  Remote entries win
// when they are the same record (so a teammate's status is not reset), while
// locally-created records missing from the remote collection are retained.
function mergeList(remote = [], local = []) {
  const merged = new Map(remote.map(item => [itemKey(item), item]));
  local.forEach(item => {
    const key = itemKey(item);
    if (!merged.has(key)) merged.set(key, item);
  });
  return [...merged.values()];
}

function mergeWorkspace(remote, local) {
  return {
    ideas: mergeList(remote?.ideas, local?.ideas),
    plans: mergeList(remote?.plans, local?.plans),
    issues: mergeList(remote?.issues, local?.issues)
  };
}

async function boot() {
  try {
    window.teamWorkspaceApp = cloudbase.init({ env, region: 'ap-shanghai' });
    await window.teamWorkspaceApp.auth().signInAnonymously();
    const local = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const remote = await call('load');
    const workspace = mergeWorkspace(remote?.workspace || {}, local);
    const remoteJson = JSON.stringify(remote?.workspace || {});
    const next = JSON.stringify(workspace);

    // First connection uploads the walkthrough backlog instead of replacing it
    // with the old three-item server seed.
    if (remoteJson !== next) await call('save', workspace);
    if (localStorage.getItem(storageKey) !== next) {
      syncing = true;
      localStorage.setItem(storageKey, next);
      syncing = false;
      location.reload();
      return;
    }
    window.teamWorkspaceReady = true;
  } catch (error) {
    console.warn('CloudBase 同步暂不可用，继续使用本地数据。', error);
  }
}

const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function (key, value) {
  originalSetItem.call(this, key, value);
  if (key !== storageKey || syncing || !window.teamWorkspaceReady) return;
  try {
    call('save', JSON.parse(value)).catch(error => console.warn('CloudBase 保存失败。', error));
  } catch (_) {}
};

boot();
