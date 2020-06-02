package com.reflectme.server.model;

public class FullAccount {
    private Account account;
    private AccountLogin login;

    public FullAccount(Account account, AccountLogin login) {
        this.account = account;
        this.login = login;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public AccountLogin getLogin() {
        return login;
    }

    public void setLogin(AccountLogin login) {
        this.login = login;
    }
}
