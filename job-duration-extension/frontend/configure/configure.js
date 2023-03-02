const { ShellSdk, SHELL_EVENTS } = FSMShell;

const shellSdk = ShellSdk.init(window.parent, '*');
const configureButton = document.getElementById('configure-button');
let openPopup = () => {};

shellSdk.emit(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, {
  clientIdentifier: 'login-with-token',
  auth: { response_type: 'token' }
});

shellSdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, async (event) => {

  const { cloudHost, account } = JSON.parse(event);

  configureButton.disabled = false;

  openPopup = () => {
    console.log('openPopup')

    const url = `../configure-popup/configure-popup.html?cloudHost=${cloudHost}&account=${account}`;

    const popup = window.open(url, 'configure-popup', 'height=500,width=400');

    window.focus && popup.focus();

    // When popup close, we refresh the extension to check if configuration went well
    popup.onbeforeunload = () => {
      window.location.href = '/';
    }

    return false;
  }
});

configureButton.addEventListener('click', openPopup, false);