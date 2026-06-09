// Events component
const events = [
    { 
      name: "Event Name", 
      description: "The Voyager 1 probe is currently the most distant human-made object from Earth.",
      date: "Date",
      time: "Time",
      location: "Location",
      mascot: "../assets/landing-page/mascot/hero icon.webp"
    },

    { 
      name: "Event Name", 
      description: "The Voyager 1 probe is currently the most distant human-made object from Earth.",
      date: "Date",
      time: "Time",
      location: "Location",
      mascot: "../assets/landing-page/mascot/hero icon.webp"
    },

    { 
      name: "Event Name", 
      description: "The Voyager 1 probe is currently the most distant human-made object from Earth.",
      date: "Date",
      time: "Time",
      location: "Location",
      mascot: "../assets/landing-page/mascot/hero icon.webp"
    },
];

const container = document.getElementById('events-container');

events.forEach((event, index) => {
    const isEven = index % 2 === 0;
    container.innerHTML += `
        <div class="events-card-wrapper ${isEven ? '' : 'card-reverse'}">
    <div class="events-card-holder">
        <h2 class="events-name">${event.name}</h2>
        <p class="events-card-description">${event.description}</p>
        <img class="events-mascot" src="${event.mascot}" alt="mascot" />
        <div class="events-meta">
            <div class="events-meta-item">
                <img src="../assets/events/calendar-icon.webp" alt="date" class="meta-icon" />
                <p class="events-date">${event.date}</p>
            </div>
            <div class="events-meta-item">
                <img src="../assets/events/time-icon.webp" alt="time" class="meta-icon" />
                <p class="events-time">${event.time}</p>
            </div>
            <div class="events-meta-item">
                <img src="../assets/events/location-icon.webp" alt="location" class="meta-icon" />
                <p class="events-location">${event.location}</p>
            </div>
        </div>
    </div>
    <button class="view-event-btn">View Event Details</button>
</div>
    `;
});