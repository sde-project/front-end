import http from "../modules/http.js";
import User from "../modules/user.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const my_id = window.localStorage.getItem('userId');

if (id == null || id == undefined || id == my_id) {

    const user = await User.getMe();

    $("#username").text(user.username);
    $("#bio").text(user.bio || "No bio provided");
    $("#fullname").text(user.name || "No name provided");
    $("#cryptos").text(user.cryptos.length === 0 ? "Does not follow any crypto" : user.cryptos.join(", "));
    $("#public").text(user.public ? "Public" : "Private");

    const links = $("#links");

    if (user.links === undefined || user.links.length === 0) {
        $("#links_container").hide();
    } else {

        user.links.forEach(link => {

            const icon = "https://" + link.website.split("//")[1].split("/")[0] + "/favicon.ico";

            links.append(`
            <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                <h6 class="mb-0"><a target="_blank" href="${link.website}"><img height="22px" src="${icon}"><span class="m-3">${link.text}</span></a></h6>
            </li>`
            );
        });

    }

    await fillFollowing(user);
    await fillFollowers(user);

    $("#loading").hide();
    $("#content").show();

} else {

    //Remove active from sidebar entry and change its href
    const entry = $("#sidebar_entry");
    entry.removeClass("active");
    entry.attr("href", `profile.html`);

    //Hide edit button
    $("#edit_button_row").hide();

    //Show follow button
    const follow_button = $("#follow_button");
    follow_button.show();

    const me = await User.getMe();
    const my_following = await me.getFollowing();
    const user = await User.get(id);

    const follow_fct = async () => {
        if (await me.follow(user._id) === true) {
            follow_button.text("Stop following");
            follow_button.removeClass("btn-outline-primary");
            follow_button.addClass("btn-primary");

            follow_button.off("click");
            follow_button.click(unfollow_fct);

            await fillFollowers(user);
        }
    };

    const unfollow_fct = async () => {
        if (await me.unfollow(user._id)) {
            follow_button.text("Follow");
            follow_button.removeClass("btn-primary");
            follow_button.addClass("btn-outline-primary");
            
            follow_button.off("click");
            follow_button.click(follow_fct);

            await fillFollowers(user);
        }
    };

    if (my_following.some((following) => following._id == user._id)) {
        follow_button.text("Stop following");
        follow_button.removeClass("btn-outline-primary");
        follow_button.addClass("btn-primary");

        follow_button.click(unfollow_fct);
    } else {
        follow_button.click(follow_fct);
    }

    $("#username").text(user.username);
    $("#public").text(user.public ? "Public" : "Private");

    if (user.public) {

        $("#bio").text(user.bio || "No bio provided");
        $("#fullname").text(user.name || "No name provided");
        $("#cryptos").text(user.cryptos.length === 0 ? "Does not follow any crypto" : user.cryptos.join(", "));

        if (user.links === undefined || user.links.length === 0) {
            $("#links_container").hide();
        } else {

            user.links.forEach(link => {

                const icon = "https://" + link.website.split("//")[1].split("/")[0] + "/favicon.ico";

                links.append(`
                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                    <h6 class="mb-0"><a target="_blank" href="${link.website}"><img height="22px" src="${icon}"><span class="m-3">${link.text}</span></a></h6>
                </li>`
                );
            });

        }

        await fillFollowing(user);
        await fillFollowers(user);


    } else {

        $("#links_container").hide();
        $("#right_column").hide();
        $("#bio").text("Private profile");

    }

    $("#loading").hide();
    $("#content").show();

}

async function fillFollowers(user) {
    const followers_users = await user.getFollowers();

    const followers = $("#followers");
    $("#followers_num").text(followers_users.length);

    followers.empty();
    followers_users.forEach(user => {
        followers.append(`<li class="list-group-item"><a href="?id=${user._id}">${user.username}</a></li>`);
    });
}

async function fillFollowing(user) {
    const following_users = await user.getFollowing();

    const following = $("#following");
    $("#following_num").text(following_users.length);

    following.empty();
    following_users.forEach(user => {
        following.append(`<li class="list-group-item"><a href="?id=${user._id}">${user.username}</a></li>`);
    });
}