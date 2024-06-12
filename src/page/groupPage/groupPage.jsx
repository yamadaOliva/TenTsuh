import GroupFeed from "../../component/GroupFeed/GroupFeed";
import Header from "../../component/Header/Header";
import { useParams } from "react-router-dom";
import {useEffect , useState} from "react";
import { Box } from "@material-ui/core";
export default function GroupDetail() {
  const { id } = useParams();
  return (
	<>
		<Header />
		<Box
		 bgcolor={"#f0f0f1"}
		 color={"text.primary"}
		 minHeight={"93.2vh"}
		>
			<GroupFeed groupId={id} />
		</Box>
	</>
  )
}
