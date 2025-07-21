import agenda from './jobs'

agenda.on('ready', async () => {
    console.log("Agenda is ready"); 
    agenda.start();
    await agenda.every('48 17 * * *', 'users:prayer');
});

agenda.on("error", (e) => {
    console.log(e);
});