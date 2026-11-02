
// Get HTML Elements

const zekr = document.getElementById("zekr");

const countDisplay = document.getElementById("count");

const tasbeehBtn = document.getElementById("tasbeehBtn");

const resetBtn = document.getElementById("resetBtn");

const shareBtn = document.getElementById("shareBtn");


// Current Counter

let count = 0;


// Load Saved Counter

function loadCount() {

    const savedCount = localStorage.getItem(
        "tasbeeh_" + zekr.value
    );

    count = Number(savedCount) || 0;

    countDisplay.textContent = count;

}


// Save Counter

function saveCount() {

    localStorage.setItem(
        "tasbeeh_" + zekr.value,
        count
    );

}


// Tasbeeh Button

tasbeehBtn.addEventListener("click", function () {

    count++;

    countDisplay.textContent = count;

    saveCount();

});


// Change Zekr

zekr.addEventListener("change", function () {

    loadCount();

});


// Reset Counter

resetBtn.addEventListener("click", function () {

    const confirmReset = confirm(
        "هل تريد تصفير عداد هذا الذكر؟"
    );

    if (confirmReset) {

        count = 0;

        countDisplay.textContent = count;

        saveCount();

    }

});


// Share Website

shareBtn.addEventListener("click", async function () {

    const shareData = {

        title: "باقيات",

        text: "باقيات - صدقة جارية على روح السيد عبد العال محمد عبد الحق رشيد. إهداء من حفيده أيمن سليمان السيد. شارك الخير والدعاء له.",

        url: window.location.href

    };

    try {

        if (navigator.share) {

            await navigator.share(shareData);

        } else {

            await navigator.clipboard.writeText(
                shareData.url
            );

            alert("تم نسخ رابط الموقع، شاركه مع الآخرين.");

        }

    } catch (error) {

        if (error.name !== "AbortError") {

            alert("تعذر مشاركة الرابط. حاول مرة أخرى.");

        }

    }

});


// Start Website

loadCount();
