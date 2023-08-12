import AdminChangeSettings from "./AdminChange";
import AnnouncerSettings from "./Announcer";
import ChangeNameComponent from "./ChangeName";
import DeleteServerComponent from "./DeleteServer";
import EmbedGenSettings from "./EmbedGen";
import ResetPasswordComponent from "./ResetPassword";

const SettingsComponent = {
    Announcer: AnnouncerSettings,
    Admin: AdminChangeSettings,
    DeleteServer: DeleteServerComponent,
    EmbedGen: EmbedGenSettings,
    NameChange: ChangeNameComponent,
    ResetPass: ResetPasswordComponent,
};

export default SettingsComponent;
