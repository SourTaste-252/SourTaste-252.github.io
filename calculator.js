function calculateLiquidToSolid() {
    let liquidVolume = parseFloat(document.getElementById("liquidVolume").value);
    let concentration = parseFloat(document.getElementById("concentration").value);
    let strength = parseFloat(document.getElementById("strength").value);

    if (isNaN(liquidVolume) || isNaN(concentration) || isNaN(strength) || concentration === 0) {
        document.getElementById("liquidResult").innerHTML = "<span style='color: red;'>Please enter valid numbers.</span>";
        return;
    }

    let solidDose = (liquidVolume * concentration) / strength;
    document.getElementById("liquidResult").innerHTML = `<b>Result:</b> ${solidDose.toFixed(2)} mL`;
}

function calculateDosage() {
    let orderedDose = parseFloat(document.getElementById("orderedDose").value);
    let availableDose = parseFloat(document.getElementById("availableDose").value);
    let availableForm = parseFloat(document.getElementById("availableForm").value);

    if (isNaN(orderedDose) || isNaN(availableDose) || isNaN(availableForm) || availableDose === 0) {
        document.getElementById("dosageResult").innerHTML = "<span style='color: red;'>Please enter valid numbers.</span>";
        return;
    }

    let requiredDose = (orderedDose / availableDose) * availableForm;
    document.getElementById("dosageResult").innerHTML = `<b>Result:</b> ${requiredDose.toFixed(2)} mL/tablets`;
}
