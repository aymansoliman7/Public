
// Get HTML Elements
const zekr = document.getElementById("zekr");
const countDisplay = document.getElementById("count");
const globalCountDisplay = document.getElementById("globalCount");
const tasbeehBtn = document.getElementById("tasbeehBtn");
const resetBtn = document.getElementById("resetBtn");
const shareBtn = document.getElementById("shareBtn");

// Supabase Settings
const SUPABASE_URL = "https://mtcmkpiugwdehbxqichj.supabase.co";
const SUPABASE_KEY = "sb_publishable_c1FOcQRGSVYNhzxuJvoFqg_F8E9bJCy";

// Connect to Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Current Counter
let count = 0;
let globalCount = 0;

// Load Saved Personal Counter
function loadCount() {
    const savedCount = localStorage.getItem(
        "tasbeeh_" + zekr.value
    );

    count = Number(savedCount) || 0;
    countDisplay.textContent = count;
}

// Save Personal Counter
function saveCount() {
    localStorage.setItem(
        "tasbeeh_" + zekr.value,
        count
    );
}

// Load Global Counter
async function loadGlobalCount() {
    const { data, error } = await supabaseClient
        .from("tasbeeh_totals")
        .select("count")
        .eq("zekr", zekr.value)
        .maybeSingle();

    if (error) {
        console.error("Global counter error:", error);
        return;
    }

    globalCount = data ? Number(data.count) : 0;

    globalCountDisplay.textContent = globalCount;
}

// Increase Global Counter
async function increaseGlobalCount() {
    const { data, error } = await supabaseClient.rpc(
        "increment_tasbeeh",
        {
            p_zekr: zekr.value
        }
    );

    if (error) {
        console.error("Could not update global counter:", error);
        alert("تم تسجيل التسبيحة على جهازك، لكن تعذر تحديث الإجمالي الجماعي.");
        return;
    }

    globalCount++;
    globalCountDisplay.textContent = globalCount;
}

// Tasbeeh Button
tasbeehBtn.addEventListener("click", async function () {
    count++;

    countDisplay.textContent = count;
    saveCount();

    await increaseGlobalCount();
});

// Change Zekr
zekr.addEventListener("change", function () {
    loadCount();
    loadGlobalCount();
});

// Reset Personal Counter Only
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
            await navigator.clipboard.writeText(shareData.url);
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
loadGlobalCount();

// Refresh Global Counter Every 10 Seconds
setInterval(loadGlobalCount, 10000);
