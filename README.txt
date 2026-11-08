JMT EXPRESS RENTALS — MULTI-PAGE FRONT-END PROTOTYPE
ITWS 02 Case Study | Units 1–5

QUICK START
1. Extract the ZIP.
2. Open the JMT-Express-Rentals folder in Visual Studio Code.
3. Open index.html using the Live Server extension (recommended).
4. Navigate the website using the top navigation bar — links stay in the same tab.

You can also double-click index.html to open it in a browser, but Live Server provides more consistent browser storage behavior.

PAGES
index.html         Home; graphite sedan enters from right, pauses, switches headlights on,
                   illuminates JMT logo, exits left and pulls curtain away.
                   Replay and Skip intro controls are included.
categories.html    Six illustrated vehicle-type cards.
vehicles.html      Vehicle showroom; category filters, search, details dialog, booking links.
availability.html  Semantic HTML availability table; selected rental dates and demo conflicts.
booking.html       Browser-side rental form, validation, add-ons, real-time price summary,
                   and confirmation review. No payment collection.
reservations.html  View/cancel browser-only demo bookings.
about.html         Project concept and the ITWS lessons applied.
css/style.css      Global design, responsive layouts, car intro animations.
js/script.js       ES6 data arrays/objects, functions, DOM updates, event listeners, booking logic.
images/            Locally bundled photorealistic concept renders for illustrative models.

WORKFLOW
Home > Vehicle Types > Select a Category > Browse Models > Details / Book
> Choose Dates > Fill Form > Review > Confirm Demo Booking > My Bookings

DEMO INVENTORY
Toyota Vios, Honda City, Toyota Raize, Mitsubishi Montero Sport,
Toyota Innova, Mitsubishi Xpander, Nissan Urvan, Toyota Hilux,
Honda Click 125, Yamaha NMAX.

IMPORTANT PROJECT LIMITATIONS
- This is only a front-end classroom demo, not a deployed rental business system.
- Prices, specifications, vehicle availability, and add-on prices are illustrative.
- The vehicle artwork is AI-generated photorealistic concept rendering, not verified
  photographs of the exact models/trims or JMT Express vehicles. Replace with
  business-authorized photos when available.
- There is no database, server-side security, payment gateway, or actual booking.
- Demo reservation records are stored in localStorage in the current browser, if enabled.
- Email, telephone, name, and driver's-license input are used for on-screen validation,
  but none of those personal details are persisted in the demo booking record.
- Client inventory, prices, contact details and policies must be verified before real use.
- Same-day pick-up and return are counted as one rental calendar day in this demo.
- You can cancel a demo booking under “My Bookings” to free its selected date range.

HOW TO CHANGE VEHICLES
In js/script.js, edit the 'fleet' array near the top. Each entry holds a model
name, category, seats, gearbox, fuel type, example rate and image path.
To swap real vehicle photos, place image files in images/ and update the image
path in that same fleet array and in the categories array below it.
To adjust styling, edit css/style.css.

HOW THIS APPLIES THE LESSONS
Unit 1: Semantic <table>, <thead>, <tbody>, <tfoot>, rowspan, colspan, responsive CSS.
Unit 2: Input types, labels, form validation, HTML attributes, select, checkboxes.
Unit 3: JavaScript basics, variables, expressions, dynamic text.
Unit 4: const/let, arrays, objects, functions, template literals, filter/map.
Unit 5: Events, addEventListener, DOM updates, click/change/input, window.confirm.

RECOMMENDED DEMO
1. Open Home in Live Server and play the opening car animation.
2. Choose SUV on Vehicle Types, inspect a model in the Showroom.
3. Click Book. Choose example dates and customer details; show the live total.
4. Confirm a demo booking. Check the record in My Bookings.
5. Open Availability to show that overlapping days are now demo-reserved.
6. Cancel the record to make the model available again.

ENJOY BUILDING!

CINEMATIC INTRO UPDATE (NOVEMBER 8, 2026)
- Based on the user-supplied 40-second car footage. The black background was
  made transparent and a ~3.2-second VP9 WebM was generated in graphite grey.
- Intro timeline (~5.25 seconds): enter right-to-left, pause on-screen,
  front-left headlamp shines toward logo, JMT name appears in the illuminated
  area, then the car drives left dragging the curtain from right to left.
- Headlamp overlay coordinates are aligned to the actual car image around
  x=4.85% and y=50.5% of the cropped 920 × 326 source.
- The headlights and curtain are HTML/CSS layers synchronized with the car
  by JavaScript; they are not physically lit lights in the original footage.
- No returning car or parking animation. The homepage has a separate, static
  red promotional sedan image.
- Intro assets: images/intro-graphite-sedan.webm (transparent animation)
  and images/intro-graphite-sedan.png (transparent fallback).
- Replay button can show the intro again. Skip hides it immediately. The
  intro does not replay automatically in the same browser tab session.
- Users with reduced-motion settings bypass the intro automatically.
- For changing scene timing, see the initIntro() function in js/script.js.
- For headlamp placement, see .intro-lamp-main and .intro-beam in css/style.css.

TO DEMONSTRATE THE INTRO
1. Launch index.html through Live Server and use Replay opening on the home page.
2. Wait for the graphite car to stop in full view.
3. Observe the headlight switching on, lighting the JMT Express mark.
4. Watch the car pull the black curtain away to reveal the normal homepage.
