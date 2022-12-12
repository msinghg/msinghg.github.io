const { ShellSdk, SHELL_EVENTS } = FSMShell;

const requireContextValue = {
    clientIdentifier: 'service-contract',
    auth: { response_type: 'token' },
};

if (ShellSdk.isInsideShell()) {
    const shellSdk = ShellSdk.init(parent, '*');
    shellSdk.emit(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, requireContextValue);
    shellSdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, (event) => {
        const { auth } = JSON.parse(event);
        initializeRefreshTokenStrategy(shellSdk, auth);
        updatePredictionUI('Select Activity');

        shellSdk.onViewState('activityID', async (activityID) => {
            sessionStorage.setItem('activityID', activityID);
            sessionStorage.setItem('event', event);

            updatePredictionUI();
            updateDurationUI();
            getActivityDto();
            getPrediction();
        });
    })
}
else {
    updatePredictionUI('Unable to reach shell eventAPI');
}


function initializeRefreshTokenStrategy(shellSdk, auth) {
    shellSdk.on(SHELL_EVENTS.Version1.REQUIRE_AUTHENTICATION, (event) => {
        sessionStorage.setItem('token', event.access_token);
        setTimeout(() => fetchToken(), (event.expires_in * 1000) - 5000);
    });

    function fetchToken() {
        shellSdk.emit(SHELL_EVENTS.Version1.REQUIRE_AUTHENTICATION, {
            response_type: 'token'
        });
    }

    sessionStorage.setItem('token', auth.access_token);
    setTimeout(() => fetchToken(), (auth.expires_in * 1000) - 5000);
}

function updatePredictionUI(text = '') {
    document.getElementById('predicted-duration').innerText = text;
}

function updateDurationUI(text = '') {
    document.getElementById('actual-duration').innerText = text;
}

function getActivityDto() {
    const event = sessionStorage.getItem('event');
    const activityID = sessionStorage.getItem('activityID');

    const { cloudHost, account, company } = JSON.parse(event);

    const url = `https://${cloudHost}/api/data/v4/Activity/${activityID}?dtos=Activity.37&account=${account}&company=${company}`;

    const headers = {
        'Content-Type': 'application/json',
        'X-Client-ID': 'fsm-extension-sample',
        'X-Client-Version': '1.0.0',
        'Authorization': `bearer ${sessionStorage.getItem('token')}`,
    };

    // Fetch Activity object
    return fetch(url, { headers })
        .then(response => response.json())
        .then((json) => {
            const planned_duration = json.data[0].activity.plannedDurationInMinutes;
            updateDurationUI(`Planned Duration: ${planned_duration}`);
        })
}

function getPrediction() {
    updatePredictionUI(`Loading...`);
    const event = sessionStorage.getItem('event');

    const { cloudHost, account, accountId, company, companyId, user, userId, auth } = JSON.parse(event);
    const activityID = sessionStorage.getItem('activityID');
    console.log('Loading prediction for activityid...', activityID);

    if (activityID) {
        const headers = {
            'Authorization': `bearer ${sessionStorage.getItem('token')}`,
            'x-account-id': accountId,
            'x-account-name': account,
            'x-company-id': companyId,
            'x-company-name': company,
            'x-user-id': userId,
            'x-user-name': user,
            'x-client-version': 'a',
            'x-cloud-host': cloudHost,
            'activity-id': activityID,
            'x-request-id': '1',
        };

        const url = 'https://ingress.qt-1.coreinfra.io/job-duration-inference/portal/predict';


        fetch(url, { headers })
            .then(response => response.json())
            .then((res) => {
                updatePredictionUI(`Predicted Duration: ${res.prediction}`);
            })
            .catch((err) => {
                updatePredictionUI(err);
            })
    }
}