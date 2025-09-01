import agenda from './jobs'
agenda.on('start', job => console.log(`Job ${job.attrs.name} starting`));
agenda.on('complete', job => console.log(`Job ${job.attrs.name} finished`));
agenda.on('fail', (err, job) => console.error(`Job ${job.attrs.name} failed: ${err.message}`));

agenda.on('ready', async () => {
    console.log("Agenda is ready"); 
    agenda.start();
    console.log("Agenda has started");
    await agenda.every('1 day', 'users:prayer');
});
