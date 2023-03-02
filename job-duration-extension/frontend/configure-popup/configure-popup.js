const params = {}

const regexp = /[?&]+([^=&]+)=([^&]*)/gi;
const replaceFn = (m, key, value) => {
  params[key] = value;
};
window.location.href.replace(regexp, replaceFn);

function toUrlEncoded(obj) {
  return Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
}

function closePopup() {
  const daddy = window.self;
  daddy.opener = window.self;
  daddy.close();
}

function saveForm() {
  const clientId = document.getElementById('input-1').value;
  const clientSecret = document.getElementById('input-2').value;

  fetch(`/configure`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: toUrlEncoded({
      cloudHost: params['cloudHost'],
      account: params['account'],
      clientId,
      clientSecret
    })
  })
    .then(response => response.json())
    .then(() => closePopup())
    .catch((exception) => alert(exception.message || 'An unknown error occurred'));

  return false;
}

const form = document.getElementById('auth-form');

form.addEventListener('submit', saveForm, false);