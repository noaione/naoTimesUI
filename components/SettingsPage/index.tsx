import AdminChangeSettings from "./AdminChange";
import AnnouncerSettings from "./Announcer";
import ChangeNameComponent from "./ChangeName";
import EmbedGenSettings from "./EmbedGen";
import ResetPasswordComponent from "./ResetPassword";

const SettingsComponent = {
    Announcer: AnnouncerSettings,
    Admin: AdminChangeSettings,
    EmbedGen: EmbedGenSettings,
    NameChange: ChangeNameComponent,
    ResetPass: ResetPasswordComponent,
};

export default SettingsComponent;
