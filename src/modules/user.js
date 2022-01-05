import http from "./http.js";

export default class User {
    
    constructor(_id, username, name, bio, pub, crytpos, links) {
        this._id = _id;
        this.username = username;
        this.name = name;
        this.bio = bio;
        this.public = pub;
        this.cryptos = crytpos;
        this.links = links;
    }

    static async get(id) {
        const response = await http.get(`/users/id/${id}`);
        if (response.status == 200) {
            const user = await response.json();
            return new User(user._id, user.username, user.name, user.bio, user.public, user.cryptos, user.links);
        } else {
            const error = await response.json();
            return error;
        }
    }

    static async getMe() {
        const response = await http.get(`/users/me`);
        if (response.status == 200) {
            const user = await response.json();
            return new User(user._id, user.username, user.name, user.bio, user.public, user.cryptos, user.links);
        } else {
            const error = await response.json();
            return error;
        }
    }

    static async getFromUsername(username) {
        const response = await http.get(`/users/fromUsername/${username}`);
        if (response.status == 200) {
            const users = await response.json();
            return users.map(user => new User(user._id, user.username, user.name, user.bio, user.public, user.cryptos, user.links));
        } else {
            const error = await response.json();
            return error;
        }
    }

    static async getFromCrypto(crypto) {
        const response = await http.get(`/users/fromCrypto/${crypto}`);
        if (response.status == 200) {
            const users = await response.json();
            return users.map(user => new User(user._id, user.username, user.name, user.bio, user.public, user.cryptos, user.links));
        } else {
            const error = await response.json();
            return error;
        }
    }

    async getFollowing() {
        const response = await http.get(`/users/id/${this._id}/following`);
        if (response.status == 200) {
            const following_users = await response.json();
            return following_users;
        } else {
            const error = await response.json();
            return error;
        }
    }

    async getFollowers() {
        const response = await http.get(`/users/id/${this._id}/followers`);
        if (response.status == 200) {
            const followers_users = await response.json();
            return followers_users;
        } else {
            const error = await response.json();
            return error;
        }
    }

    async follow(id) {
        const response = await http.put(`/users/id/${this._id}/following`, {id: id});
        if(response.status == 200) {
            return true;
        } else {
            const error = await response.json();
            return error;
        }
    }

    async unfollow(id) {
        const response = await http.delete(`/users/id/${this._id}/following/${id}`);
        if(response.status == 200) {
            return true;
        } else {
            const error = await response.json();
            return error;
        }
    }

    async update() {

        const response = await http.put(`/users/id/${this._id}`, {
            name: this.name,
            bio: this.bio,
            links: this.links,
            cryptos: this.cryptos,
            public: this.public
        });

        if (response.status == 200) {
            return true;
        } else {
            const error = await response.json();
            return error;
        }
    }

}