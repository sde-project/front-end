import User from "../modules/user.js";

$(document).ready(() => {
    $('#user-search-bar').autocomplete({
    
        source: function (request, response) {
    
            User.getFromUsername(request.term).then((users) => {
                response(users.map((user) => {
                    return {
                        label: user.username,
                        value: user.username,
                        extradata: user._id
                    };
                }));
            });
    
        }
    
    });
    
    $('#user-search-bar').on('autocomplete.select', function (event, data, jItem) {
        console.log(data);
        window.location.href = `/html/profile.html?id=${data.extradata}`;
    });
});