import cloudbase from 'https://cdn.jsdelivr.net/npm/@cloudbase/js-sdk@3.7.1/dist/index.esm.js';

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

async function boot() {
  try {
    window.teamWorkspaceApp = cloudbase.init({ env, region: 'ap-shanghai' });
    const auth = window.teamWorkspaceApp.auth();
    await auth.signInAnonymously();
    const remote = await call('load');
    if (remote.ok && remote.workspace) {
      const current = localStorage.getItem(storageKey);
      const next = JSON.stringify(remote.workspace);
      if (current !== next) {
        syncing = true;
        localStorage.setItem(storageKey, next);
        syncing = false;
        location.reload();
        return;
      }
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
