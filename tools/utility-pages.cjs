module.exports = (file, { section, btn, photo, icon }) => {
    if (file === "pages/404.html")
        return section(
            "Page not found",
            `<div class="standalone-grid"><div class="standalone-copy"><span class="eyebrow">A SMALL WRONG TURN</span><div class="standalone-code" aria-hidden="true">404</div><h1>This page is out for a spin.</h1><p>The page you’re looking for may have moved. Let’s get you back to a fresh start.</p><div class="actions">${btn("Go home", "pages/index.html")}<button class="btn btn-secondary" data-go-back>Go back ${icon("arrow")}</button></div></div><figure class="utility-picture"><div class="utility-photo">${photo("utility/fresh-way-back.webp", "A woman folding fresh laundry")}</div><figcaption>A small detour. A cleaner routine ahead.</figcaption></figure></div>`,
            "standalone-section",
        );
    return section(
        "Coming soon",
        `<div class="standalone-grid"><div class="standalone-copy"><span class="eyebrow">COMING SOON</span><h1>A fresh start.<br>Coming to your neighborhood.</h1><p>We’re putting the finishing touches on a new Stillwater wash center. More room to wash. A little more time for you.</p><div class="countdown" data-countdown="2027-06-01T10:00:00-04:00" aria-label="Time until demo opening"></div><form data-demo-form data-success="Demo signup validated. Connect an email platform to collect notifications."><label for="notify-email">Be first to hear about opening day</label><div class="launch-input"><input id="notify-email" type="email" name="email" required class="form-control" placeholder="Your email address" autocomplete="email"><button class="btn btn-primary">Notify me</button></div><p class="form-status" role="status"></p></form><p class="small-note">Illustrative opening: June 1, 2027. Notification signup is a demo.</p></div><div class="launch-picture">${photo("utility/fresh-routine-ahead.webp", "A family folding fresh laundry together", true)}<div class="launch-feature"><span class="eyebrow">LAUNDRY, THOUGHTFULLY DONE</span><h2>Your next wash.<br>A simpler routine.</h2><p>Spacious machines, clear prices and carefully folded laundry. The little things that make a fresh week easier.</p><div class="launch-features"><span>${icon("washer")} Self-service</span><span>${icon("check")} Clear prices</span><span>${icon("clock")} Open daily</span></div></div></div></div>`,
        "standalone-section",
    );
};
