import http from "../modules/http.js";
import User from "../modules/user.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const my_id = window.localStorage.getItem('userId');

$(document).ready(async () => {

    if (id == null || id == undefined || id == my_id) {

        const user = await User.getMe();
    
        $("#username").text(user.username);
        $("#bio").text(user.bio || "No bio provided");
        $("#fullname").text(user.name || "No name provided");
        $("#cryptos").text(user.cryptos.length === 0 ? "Does not follow any crypto" : user.cryptos.join(", "));
        $("#public").text(user.public ? "Public" : "Private");
    
        if (user.links === undefined || user.links.length === 0) {
            $("#links_container").hide();
        } else {
            fillLinks(user);
        }
    
        fillFollowing(user);
        fillFollowers(user);
        fillSimilar(user);
    
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
                fillLinks(user);
            }
    
            fillFollowing(user);
            fillFollowers(user);
            fillSimilar(user);
    
    
        } else {
    
            $("#links_container").hide();
            $("#right_column").hide();
            $("#bio").text("Private profile");
    
        }
    
        $("#loading").hide();
        $("#content").show();
    
    }

});

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

async function fillLinks(user) {

    const links = $("#links");
    links.empty();

    user.links.forEach((link) => {

        let icon = null;

        try {
            icon = "https://" + link.website.split("//")[1].split("/")[0] + "/favicon.ico";
        } catch(e) {}

        const li = $("<li>");
        li.addClass("list-group-item");
        li.addClass("d-flex");
        li.addClass("justify-content-between");
        li.addClass("align-items-center");
        li.addClass("flex-wrap");

        const h6 = $("<h6>");
        h6.addClass("mb-0");
        li.append(h6);

        const a = $("<a>");
        a.attr("href", link.website);
        a.attr("target", "_blank");
        h6.append(a);

        const img = $("<img>");
        img.attr("height", "22px");
        img.attr("src", icon || "/assets/link.png");
        a.append(img);

        const span = $("<span>");
        span.addClass("m-3");
        span.text(link.text);
        a.append(span);

        links.append(li);
    });
}

async function fillSimilar(user) {

    if(user.cryptos.length === 0) {
        $("#similar_container").hide();
    } else {

        const crypto_followers = await Promise.all(user.cryptos.map(async (crypto) => {
            return {
                crypto: crypto,
                users: (await User.getFromCrypto(crypto)).filter((u) => u._id != user._id)
            };
        }));

        const rankings = [];

        crypto_followers.forEach((followers) => {
            const crypto = followers.crypto;
            followers.users.forEach((user) => {
                const index = rankings.findIndex((r) => r.user._id == user._id);
                if(index !== -1) {
                    rankings[index].cryptos.push(crypto);
                } else {
                    rankings.push({
                        cryptos: [crypto],
                        user: user
                    });
                }
            });
        });

        rankings.sort((a, b) => b.cryptos.length - a.cryptos.length);

        const similar = $("#similar");
        similar.empty();

        rankings.map((r) => {
            similar.append(`<li class="list-group-item w-100"><a href="?id=${r.user._id}">${r.user.username}</a><span class="text-muted" style="float:right">${r.cryptos.join(", ")}</span></li>`)
        });

    }

}