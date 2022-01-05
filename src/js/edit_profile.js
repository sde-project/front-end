import http from "../modules/http.js";
import User from "../modules/user.js";

const user = await User.getMe();

$(document).ready(async () => {

    $("#username").text(user.username);
    $("#bio_input").val(user.bio || "");
    $("#fullname_input").val(user.name || "");
    $("#public_input").prop("checked", user.public);

    await fillLinks(user);

    $("#loading").hide();
    $("#content").show();

    $("#save_btn").click(async () => {
        user.bio = $("#bio_input").val();
        user.name = $("#fullname_input").val();
        user.public = $("#public_input").prop("checked");

        if((await user.save()) === true) {
            window.location.href = "profile.html";
        }
    });

    $("#add_link_modal").on('show.bs.modal', function (event) {
        $("#link_input").val("");
        $("#link_input").focus();
        $("#link_text_input").val("");
    });

    $("#save_link_btn").click(async () => {
            
        const link = $("#link_input").val();
        const text = $("#link_text_input").val();

        if (link.length > 0 && text.length > 0) {
            user.links.push({ website: link, text: text });
            if ((await user.save()) === true) {
                await fillLinks(user);
            }
        }

        $("#add_link_modal").modal("hide");
    });

});

async function fillLinks(user) {

    const links = $("#links");
    links.empty();

    user.links.forEach((link, index) => {

        const icon = "https://" + link.website.split("//")[1].split("/")[0] + "/favicon.ico";

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
        img.attr("src", icon);
        a.append(img);

        const span = $("<span>");
        span.addClass("m-3");
        span.text(link.text);
        a.append(span);

        const button = $("<button>");
        button.addClass("btn");
        button.addClass("btn-outline-danger");
        button.addClass("btn-sm");
        button.text("Remove");
        button.click(() => removeLink(index));
        li.append(button);

        links.append(li);
    });
}

async function removeLink(index) {
    user.links = user.links.splice(index, 1);
    
    if((await user.save()) === true) {
        await fillLinks(user);
    }
}