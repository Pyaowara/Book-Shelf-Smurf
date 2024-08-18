import { UserInterface } from "./user.interface";

export class User implements UserInterface{
    private userId: number;
    private userName: string;
    private userPass: string;
    private userEmail: string;
    private userPhone: string;
    private userPermission: string;
    private userImage: string;
    private userDescriptions: string;

    constructor(
        userId: number,
        userName: string,
        userPass: string,
        userEmail: string,
        userPermission: string,
        userPhone: string,
        userImage: string,
        userDescriptions: string
    ) {
        this.userId = userId;
        this.userName = userName;
        this.userPass = userPass;
        this.userEmail = userEmail;
        this.userPermission = userPermission;
        this.userPhone = userPhone;
        this.userImage = userImage;
        this.userDescriptions = userDescriptions;
    }

    public getUserId(): number {
        return this.userId;
    }

    public setUserId(userId: number): void {
        this.userId = userId;
    }

    public getUserName(): string {
        return this.userName;
    }

    public setUserName(userName: string): void {
        this.userName = userName;
    }

    public getUserPass(): string {
        return this.userPass;
    }

    public setUserPass(userPass: string): void {
        this.userPass = userPass;
    }

    public getUserEmail(): string {
        return this.userEmail;
    }

    public setUserEmail(userEmail: string): void {
        this.userEmail = userEmail;
    }

    public getUserPhone(): string {
        return this.userPhone;
    }

    public setUserPhone(userPhone: string): void {
        this.userPhone = userPhone;
    }

    public getUserPermission(): string {
        return this.userPermission;
    }

    public setUserPermission(userPermission: string): void {
        this.userPermission = userPermission;
    }

    public getUserImage(): string{
        return this.userImage;
    }

    public setUserImage(userImage: string): void {
        this.userImage = userImage;
    }

    public getUserDescriptions(): string {
        return this.userDescriptions;
    }

    public setUserDescriptions(userDescriptions: string): void {
        this.userDescriptions = userDescriptions;
    }
}