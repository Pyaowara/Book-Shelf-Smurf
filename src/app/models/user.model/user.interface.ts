export interface UserInterface {
    getUserId(): number;
    setUserId(userId: number): void;

    getUserName(): string;
    setUserName(userName: string): void;

    getUserPass(): string;
    setUserPass(userPass: string): void;

    getUserEmail(): string;
    setUserEmail(userEmail: string): void;

    getUserPhone(): string;
    setUserPhone(userPhone: string): void;

    getUserPermission(): string;
    setUserPermission(userPermission: string): void;

    getUserImage(): string;
    setUserImage(userImage: string): void;

    getUserDescriptions(): string;
    setUserDescriptions(userDescriptions: string): void;
}