console.log('battery');

const registerBattery = async () => {
    const n: any = window.navigator;
    const b = await n.getBattery();

    let timeStamp = 0;
    const content = document.getElementById('content');

    b.addEventListener("chargingchange", (e: any) => {
        const diff = e.timeStamp - timeStamp;
        timeStamp = e.timeStamp;
        console.log('change', e.target.charging, diff);
        if (content) {
            console.log(content.innerHTML);
            let list = content.innerHTML.length > 0 ? JSON.parse(content.innerHTML) : [];
            list.push({ state: e.target.charging, diff });
            content.innerHTML = JSON.stringify(list);
        }
    });
}

registerBattery();