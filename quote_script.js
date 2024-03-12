function transitionTo(nextStepId) {
    const currentStep = document.querySelector('.step:not(.hidden)');
    const nextStep = document.getElementById(nextStepId);

    currentStep.classList.add('hidden');
    setTimeout(() => {
        currentStep.style.display = 'none';
        nextStep.style.display = 'block';
        setTimeout(() => nextStep.classList.remove('hidden'), 100);
    }, 500);
}

function selectRegion(region) {
    console.log("Selected region: " + region);
    // Additional functionality
}