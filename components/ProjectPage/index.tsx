import AliasComponent from "./AliasComponent";
import EpisodeComponent from "./EpisodeComponent";
import EpisodeAddComponent from "./EpisodeAddComponent";
import EpisodeModifyComponent from "./EpisodeModifyComponent";
import NukeProjectComponent from "./NukeComponent";
import StaffComponent from "./StaffComponent";

const ProjectPageComponent = {
    Aliases: AliasComponent,
    Deletion: NukeProjectComponent,
    Episode: EpisodeComponent,
    EpisodeAdd: EpisodeAddComponent,
    EpisodeModify: EpisodeModifyComponent,
    Staff: StaffComponent,
};

export default ProjectPageComponent;
