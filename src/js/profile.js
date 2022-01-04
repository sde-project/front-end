import http from "../modules/http.js";

http.get("/users/me").then(async function (response) {
    if (response.status == 200) {

        const user = await response.json();

        $("#username").text(user.username);
        $("#bio").text(user.bio || "");
        $("#fullname").text(user.name || "");
        $("#public").text(user.public ? "Public" : "Private");
        $("#cryptos").text(user.cryptos.join(", "));

        const links = $("#links");
        user.links.forEach(link => {

            const icon = "https://" + link.website.split("//")[1].split("/")[0] + "/favicon.ico";

            links.append(`
                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                    <h6 class="mb-0"><a target="_blank" href="${link.website}"><img height="22px" src="${icon}"><span class="m-3">${link.text}</span></a></h6>
                </li>`
            );
        });
        

        http.get(`/users/id/${user._id}/following`).then(async response => {
            if (response.status == 200) {
                const following_users = await response.json();

                const following = $("#following");
                $("#following_num").text(following_users.length);

                following_users.forEach(user => {
                    following.append(`<li class="list-group-item">${user.username}</li>`);
                });
            }
        });

        http.get(`/users/id/${user._id}/followers`).then(async response => {
            if (response.status == 200) {
                const followers_users = await response.json();

                const followers = $("#followers");
                $("#followers_num").text(followers_users.length);
                
                followers_users.forEach(user => {
                    followers.append(`<li class="list-group-item">${user.username}</li>`);
                });
            }
        });

        $("#loading").hide();
        $("#content").show();

    } else {
        console.log("Error getting user");
        alert("Error getting user");
    }
});