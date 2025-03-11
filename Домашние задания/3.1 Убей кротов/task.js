(() => {
    let playing = true,
        activeHole = 1,
        deadCount = 0,
        lostCount = 0;

    const stop = () => playing = false,
        getHole = index => document.getElementById(`hole${index}`),
        deactivateHole = index => getHole(index).className = 'hole',
        activateHole = index => getHole(index).className = 'hole hole_has-mole',
        updateStatus = () => {
            document.getElementById('dead').textContent = deadCount;
            document.getElementById('lost').textContent = lostCount;
        };

    for (let i = 1; i <= 9; i++) {
        getHole(i).onclick = () => {
            if (!playing) return;

            if (getHole(i).classList.contains('hole_has-mole')) {
                deadCount++;
            } else {
                lostCount++;
            }
            
            updateStatus();

            if (deadCount === 10) {
                alert('Вы победили!');
                resetGame();
            } else if (lostCount === 5) {
                alert('Вы проиграли!');
                resetGame();
            }
        };
    }

    const next = () => setTimeout(() => {
        if (!playing) return;
        deactivateHole(activeHole);
        activeHole = Math.floor(1 + Math.random() * 9);
        activateHole(activeHole);
        next();
    }, 800);

    const resetGame = () => {
        deadCount = 0;
        lostCount = 0;
        updateStatus();
        playing = true;
    };

    next();
})();
