import AdminChangeSettings from "./AdminChange";
import AnnouncerSettings from "./Announcer";
import ChangeNameComponent from "./ChangeName";
import ResetPasswordComponent from "./ResetPassword";

const SettingsComponent = {
    Announcer: AnnouncerSettings,
    Admin: AdminChangeSettings,
    NameChange: ChangeNameComponent,
    ResetPass: ResetPasswordComponent,
};

export default SettingsComponent;
