const getAppName = (): string => {
    // get the app name from the URL. So for example https://stan-assistant.vercel.app would return "stan-assistant"
    // and http://stan-assistant.localhost:3000 would return "stan-assistant"
    // and https://chat.neurosift.app would return "neurosift-chat"
    if (typeof window === 'undefined') {
        return "unknown-app";
    }
    if (window.location.hostname === 'chat.neurosift.app') {
        return "neurosift-chat";
    }
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 2) {
        return parts[0];
    }
    return "unknown-app";
}

export default getAppName;