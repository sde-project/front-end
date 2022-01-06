export default class Toast {

    constructor(title, body) {
        this.title = title;
        this.body = body;
        this.id = "toast-" + Math.random().toString(36).replace(/[^a-z]+/g, '');
    }

    async show() {

        if ($("#toast-container").length == 0) {
            createContainer();
        }

        const toast = $("<div>");
        toast.addClass("toast m-3");
        toast.attr("role", "alert");
        toast.attr("aria-live", "assertive");
        toast.attr("aria-atomic", "true");
        toast.attr("id", this.id);

        const toastHeader = $("<div>");
        toastHeader.addClass("toast-header");

        const toastTitle = $("<strong>");
        toastTitle.addClass("mr-auto");
        toastTitle.text(this.title);

        toastHeader.append(toastTitle);

        const toastBody = $("<div>");
        toastBody.addClass("toast-body");
        toastBody.text(this.body);

        toast.append(toastHeader);
        toast.append(toastBody);

        $("#toast-container").append(toast);

        toast.toast("show");
        toast.on('hidden.bs.toast', function () {
            toast.remove();
        })
    }

}

function createContainer() {
    $("body").append(`
    <div aria-live="polite" aria-atomic="true" style="min-height: 200px;">
        <div style="position: absolute; bottom: 0; right: 0;" id="toast-container"> </div>
    </div>`
    )
}