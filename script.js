$(document).ready(function () {

    const party = [
        {
            id: "balcony",
            name: "Balcony",
            floor: 2,
            guests: [
                {
                    name: "Aigerim",
                    color: "green",
                    time: "20:45",
                    aitu: true,
                    items: ["cup", "crumbs"]
                },
                {
                    name: "Aliya",
                    color: "black",
                    time: "21:15",
                    aitu: false,
                    items: ["phone", "cup"]
                },
                {
                    name: "Madina",
                    color: "green",
                    time: "22:10",
                    aitu: false,
                    items: ["phone", "bag", "crumbs"]
                },
                {
                    name: "Ivan",
                    color: "black",
                    time: "20:10",
                    aitu: true,
                    items: ["cup"]
                }
            ]
        },
        {
            id: "hall",
            name: "Hall",
            floor: 2,
            guests: [
                {
                    name: "Arman",
                    color: "yellow",
                    time: "20:35",
                    aitu: false,
                    items: ["bag", "glasses"]
                },
                {
                    name: "Sophia",
                    color: "purple",
                    time: "21:20",
                    aitu: true,
                    items: ["phone"]
                },
                {
                    name: "Dias",
                    color: "green",
                    time: "19:45",
                    aitu: true,
                    items: []
                },
                {
                    name: "Bekzat",
                    color: "purple",
                    time: "20:55",
                    aitu: false,
                    items: ["bag", "cup", "crumbs"]
                },
                {
                    name: "Aruzhan",
                    color: "blue",
                    time: "21:50",
                    aitu: true,
                    items: ["phone"]
                },
                {
                    name: "Saule",
                    color: "green",
                    time: "21:25",
                    aitu: false,
                    items: ["glasses"]
                }
            ]
        },
        {
            id: "kitchen",
            name: "Kitchen",
            floor: 1,
            guests: [
                {
                    name: "Nurlan",
                    color: "red",
                    time: "19:40",
                    aitu: true,
                    items: ["phone", "cup"]
                },
                {
                    name: "Emma",
                    color: "black",
                    time: "20:15",
                    aitu: false,
                    items: ["bag"]
                },
                {
                    name: "Timur",
                    color: "green",
                    time: "21:05",
                    aitu: true,
                    items: ["phone", "bag", "crumbs"]
                },
                {
                    name: "Sergey",
                    color: "yellow",
                    time: "20:50",
                    aitu: false,
                    items: []
                },
                {
                    name: "Yerlan",
                    color: "red",
                    time: "21:40",
                    aitu: true,
                    items: ["glasses", "phone"]
                },
                {
                    name: "Kamila",
                    color: "green",
                    time: "20:05",
                    aitu: false,
                    items: ["cup"]
                }
            ]
        },
        {
            id: "living",
            name: "Living Room",
            floor: 1,
            guests: [
                {
                    name: "Daniel",
                    color: "blue",
                    time: "19:55",
                    aitu: true,
                    items: ["glasses"]
                },
                {
                    name: "Zarina",
                    color: "green",
                    time: "21:10",
                    aitu: false,
                    items: ["bag", "phone", "crumbs"]
                },
                {
                    name: "Natasha",
                    color: "yellow",
                    time: "20:30",
                    aitu: true,
                    items: []
                },
                {
                    name: "Askar",
                    color: "black",
                    time: "21:00",
                    aitu: true,
                    items: ["phone"]
                },
                {
                    name: "Inkar",
                    color: "purple",
                    time: "20:20",
                    aitu: false,
                    items: ["bag"]
                }
            ]
        }
    ];

    function buildParty() {

        $(".guests").empty();

        party.forEach(function (room) {

            room.guests.forEach(function (guest) {

                const avatar =
                    "https://api.dicebear.com/9.x/notionists/svg?seed="
                    + encodeURIComponent(guest.name);

                const card = $("<div>")
                    .addClass("guest")
                    .addClass("color-" + guest.color)
                    .toggleClass("aitu", guest.aitu)
                    .attr("data-name", guest.name)
                    .attr("data-time", guest.time)
                    .attr("data-color", guest.color)
                    .attr("data-aitu", guest.aitu)
                    .attr("data-items", guest.items.join(","));

                const image = $("<img>")
                    .attr("src", avatar)
                    .attr("alt", guest.name);

                const name = $("<p>")
                    .addClass("guest-name")
                    .text(guest.name);

                const time = $("<p>")
                    .addClass("guest-time")
                    .text(guest.time);

                const items = $("<div>")
                    .addClass("guest-items");

                const itemIcons = {
                    phone: "📱",
                    glasses: "👓",
                    bag: "👜",
                    cup: "☕",
                    crumbs: "🍰"
                };

                guest.items.forEach(function (item) {
                    items.append(
                        $("<span>")
                            .attr("title", item)
                            .text(itemIcons[item])
                    );
                });

                card.append(image, name, time, items);

                if (guest.aitu) {
                    card.append(
                        $("<span>")
                            .addClass("aitu-badge")
                            .text("AITU")
                    );
                }

                $("#" + room.id + " .guests").append(card);

            });

        });

    }

        buildParty();

    const cases = [
        "Who is in the hall?",
        "Who is dressed in yellow or purple?",
        "Which AITU students are upstairs?",
        "Who has glasses or a bag?",
        "Who came with nothing at all?",
        "Who has a phone but no bag?",
        "Who arrived between 20:30 and 21:00?",
        "Who arrived after 21:00 and is not an AITU student?",
        "Who stands right next to Askar?",
        "Who stands last in each room?",
        "Who stands third in each room?",
        "Who stands after Timur in his room?",
        "Who stands right before someone in black?",
        "In which room is Aruzhan?",
        "Which rooms have fewer than 6 guests?",
        "Which rooms have a cup but no glasses?",
        "Who came first to each room?",
        "Miras joins the party!",
        "Natasha leaves the party!",
        "Who took the cake?"
    ];

    cases.forEach(function (question, index) {
        const button = $("<button>")
            .text("Case " + (index + 1))
            .attr("title", question)
            .attr("data-case", index + 1);

        $("#caseButtons").append(button);
    });

    $("#caseButtons").on("click", "button", function () {

        const caseNumber = Number($(this).attr("data-case"));

        // Reset previous investigation
        $(".room").removeClass("found");
        buildParty();

        // Reset previous result
        $("#result").text("");

        let found;

        switch (caseNumber) {

            case 1:
                found = $("#hall .guest");
                break;

            case 2:
                found = $(".guest.color-yellow, .guest.color-purple");
                break;

            case 3:
                found = $("#floor2 .guest.aitu");
                break;

            case 4:
                found = $(".guest").filter(function () {
                    const items = $(this).attr("data-items").split(",");
                    return items.includes("glasses") || items.includes("bag");
                });
                break;

            case 5:
                found = $(".guest[data-items='']");
                break;
            
            case 6:
                found = $(".guest")
                    .filter("[data-items*='phone']")
                    .not("[data-items*='bag']");
                break;

            case 7:
                found = $(".guest").filter(function () {
                    const time = $(this).attr("data-time");
                    return time >= "20:30" && time <= "21:00";
                });
                break;

            case 8:
                found = $(".guest:not(.aitu)").filter(function () {
                    return $(this).attr("data-time") > "21:00";
                });
                break;

            case 9:
                found = $(".guest[data-name='Askar']")
                    .prev()
                    .add($(".guest[data-name='Askar']").next());
                break;

            case 10:
                found = $(".room .guests .guest:last-child");
                break;
                    
            case 11:
                found = $(".room .guests .guest:nth-child(3)");
                break;

            case 12:
                found = $(".guest[data-name='Timur']").nextAll();
                break;

            case 13:
                found = $(".guest.color-black").prev(".guest");
                break;
            
            case 14:
                found = $(".guest[data-name='Aruzhan']").closest(".room");
                break;
            
            case 15:
                found = $(".room").filter(function () {
                    return $(this).find(".guest").length < 6;
                });
                break;

            case 16:
                found = $(".room").filter(function () {
                    return $(this).find(".guest[data-items*='cup']").length > 0 &&
                        $(this).find(".guest[data-items*='glasses']").length === 0;
                });
                break;

            case 17:
                found = $();

                $(".room").each(function () {

                    const first = $(this).find(".guest").toArray().reduce(function (earliest, current) {
                        if (!earliest) return current;

                        return $(current).attr("data-time") <
                            $(earliest).attr("data-time")
                            ? current
                            : earliest;
                    }, null);

                    if (first) {
                        found = found.add(first);
                    }

                });
                break;
            
            case 18: {
                const miras = $("<div>")
                    .addClass("guest color-blue aitu")
                    .attr("data-name", "Miras")
                    .attr("data-time", "21:20")
                    .attr("data-color", "blue")
                    .attr("data-aitu", "true")
                    .attr("data-items", "phone")
                    .css("display", "none");

                const avatar = $("<img>")
                    .attr(
                        "src",
                        "https://api.dicebear.com/9.x/notionists/svg?seed=Miras"
                    )
                    .attr("alt", "Miras");

                miras.append(
                    avatar,
                    $("<p>").addClass("guest-name").text("Miras"),
                    $("<p>").addClass("guest-time").text("21:20"),
                    $("<div>").addClass("guest-items").text("📱"),
                    $("<span>").addClass("aitu-badge").text("AITU")
                );

                $(".guest[data-name='Askar']").after(miras);

                miras.fadeIn(400);

                found = miras;
                break;
            }

            case 19:
                found = $(".guest[data-name='Natasha']");

                found.fadeOut(400, function () {
                    $(this).remove();
                });

                break;
            
            case 20:
                found = $("#floor1 .guest").filter(function () {

                    const guest = $(this);
                    const time = guest.attr("data-time");
                    const items = guest.attr("data-items").split(",");

                    const correctTime = time > "21:00" && time < "21:30";

                    const hasCrumbs = items.includes("crumbs");
                    const noCup = !items.includes("cup");

                    const nextToAITU =
                        guest.prev().hasClass("aitu") ||
                        guest.next().hasClass("aitu");

                    return correctTime &&
                        hasCrumbs &&
                        noCup &&
                        nextToAITU;
                });
                break;
            
            
            }

        found.addClass("found");

        found.each(function () {
            $(this)
                .css("position", "relative")
                .stop(true, true)
                .animate({ top: "-12px" }, 180)
                .animate({ top: "0px" }, 180);
        });

        const names = found.map(function () {
            return $(this).attr("data-name") ||
                $(this).find(".room-header h3").first().text();
        }).get();

        $("#result").text(
            "Case " + caseNumber +
            " | Found: " + found.length +
            " | " + (names.join(", ") || "Nobody")
        );

    });

});

