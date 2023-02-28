import {
  Box,
  Button,
  Flex,
  Divider,
  createIcon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
  Link,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

// button abstraction to include the Link and styling
const StyleButton = ({ children, link }: { children: any; link: string }) => {
  const router = useRouter();
  const isActive = router.pathname === link;
  return (
    <>
      <Link href={link} width="100%">
        <Button
          justifyContent="flex-start"
          bg="transparent"
          height="9"
          width="100%"
          borderRadius={10}
          // temporary until I figure out custom color schemes
          style={{
            background: isActive ? "#FAFA78" : "white",
          }}
          _hover={{
            background: "#FAFA78 !important",
          }}
          isActive={isActive}
        >
          {children}
        </Button>
      </Link>
    </>
  );
};

const OverViewIcon = createIcon({
  displayName: "OverviewIcon",
  viewBox: "0 0 17 17",
  d: "M9.44444 5.66667V0H17V5.66667H9.44444ZM0 9.44444V0H7.55556V9.44444H0ZM9.44444 17V7.55556H17V17H9.44444ZM0 17V11.3333H7.55556V17H0Z",
});

const ToDoIcon = createIcon({
  displayName: "ToDoIcon",
  viewBox: "0 0 25 25",
  d: "M23.9583 12.4945L21.4167 9.59863L21.7708 5.7653L18.0104 4.91113L16.0417 1.59863L12.5 3.11947L8.95832 1.59863L6.98957 4.91113L3.22916 5.75488L3.58332 9.58822L1.04166 12.4945L3.58332 15.3903L3.22916 19.234L6.98957 20.0882L8.95832 23.4007L12.5 21.8695L16.0417 23.3903L18.0104 20.0778L21.7708 19.2236L21.4167 15.3903L23.9583 12.4945ZM19.2604 14.6924L19.5312 17.5986L16.6771 18.2445L15.1875 20.7549L12.5 19.5986L9.81249 20.7549L8.32291 18.2445L5.46874 17.5986L5.73957 14.682L3.81249 12.4945L5.73957 10.2861L5.46874 7.3903L8.32291 6.75488L9.81249 4.24447L12.5 5.3903L15.1875 4.23405L16.6771 6.74447L19.5312 7.3903L19.2604 10.2965L21.1875 12.4945L19.2604 14.6924ZM11.4583 15.6195H13.5417V17.7028H11.4583V15.6195ZM11.4583 7.28613H13.5417V13.5361H11.4583V7.28613Z",
});

const PendingIcon = createIcon({
  displayName: "PendingIcon",
  viewBox: "0 0 14 21",
  d: "M0 2.25C0 1.65317 0.211191 1.08099 0.587045 0.658928C0.963049 0.237051 1.47283 0 2.00455 0H11.3591C12.0753 0 12.7371 0.428914 13.095 1.125C13.4531 1.82109 13.4531 2.67891 13.095 3.375C12.7371 4.07108 12.0753 4.5 11.3591 4.5H2.00455C1.47283 4.5 0.96306 4.26295 0.587045 3.84107C0.211191 3.41903 0 2.84683 0 2.25ZM13.3636 18.75C13.3636 19.3468 13.1524 19.919 12.7766 20.3411C12.4006 20.7629 11.8908 21 11.3591 21H2.00455C1.36962 21.0013 0.771998 20.6643 0.394037 20.0918C0.0159488 19.5193 -0.0974015 18.7793 0.0885821 18.098C0.274421 17.4166 0.73752 16.8747 1.33636 16.638V14.7285C1.33577 13.9941 1.52727 13.2757 1.88733 12.6623C2.24722 12.0491 2.75955 11.568 3.36092 11.2785L4.98601 10.5L3.36092 9.71858C2.76001 9.42947 2.24784 8.94866 1.88794 8.33593C1.52819 7.7232 1.3364 7.00551 1.3364 6.27158V5.14658C1.55431 5.21305 1.77878 5.24787 2.00458 5.25005H11.3591C11.5849 5.24686 11.8096 5.21104 12.0273 5.14357V6.26857C12.0285 7.00319 11.837 7.72203 11.477 8.33544C11.1168 8.94881 10.6039 9.4298 10.002 9.71857L8.37766 10.5L10.002 11.2815C10.6035 11.5699 11.1162 12.0506 11.4762 12.6635C11.8362 13.2762 12.0279 13.9944 12.0273 14.7285V16.638C12.4167 16.7927 12.7543 17.0784 12.9935 17.4565C13.2327 17.8346 13.362 18.2862 13.3636 18.75ZM2.67273 14.7285V16.5H10.6909V14.7285C10.6911 14.2882 10.5759 13.8574 10.3599 13.4896C10.1441 13.122 9.83674 12.8335 9.47612 12.66L6.68182 11.316L3.88752 12.66C3.52688 12.8336 3.21949 13.122 3.00369 13.4896C2.78772 13.8574 2.67258 14.2882 2.67273 14.7285Z",
});

const CompletedIcon = createIcon({
  displayName: "CompletedIcon",
  viewBox: "0 0 28 28",
  d: "M10.2667 18.5503L5.36667 13.6503L3.73334 15.2836L10.2667 21.8169L24.2667 7.81693L22.6333 6.18359L10.2667 18.5503Z",
});

const HistoryIcon = createIcon({
  displayName: "HistoryIcon",
  viewBox: "0 0 28 24",
  d: "M15.875 0.75C9.6625 0.75 4.625 5.7875 4.625 12H0.875L5.875 16.9875L10.875 12H7.125C7.125 7.1625 11.0375 3.25 15.875 3.25C20.7125 3.25 24.625 7.1625 24.625 12C24.625 16.8375 20.7125 20.75 15.875 20.75C13.4625 20.75 11.275 19.7625 9.7 18.175L7.925 19.95C9.9625 21.9875 12.7625 23.25 15.875 23.25C22.0875 23.25 27.125 18.2125 27.125 12C27.125 5.7875 22.0875 0.75 15.875 0.75ZM14.625 7V13.25L19.9375 16.4L20.9 14.8L16.5 12.1875V7H14.625Z",
});

const SettingsIcon = createIcon({
  displayName: "SettingsIcon",
  viewBox: "0 0 24 24",
  d: "M20.4128 13.176C20.4604 12.792 20.4961 12.408 20.4961 12C20.4961 11.592 20.4604 11.208 20.4128 10.824L22.9229 8.844C23.1489 8.664 23.2084 8.34 23.0656 8.076L20.6864 3.924C20.5794 3.732 20.3771 3.624 20.163 3.624C20.0916 3.624 20.0202 3.636 19.9608 3.66L16.9987 4.86C16.3801 4.38 15.7139 3.984 14.9882 3.684L14.5362 0.504C14.5005 0.216 14.2507 0 13.9533 0H9.19485C8.89745 0 8.64763 0.216 8.61194 0.504L8.15989 3.684C7.43423 3.984 6.76805 4.392 6.14946 4.86L3.18734 3.66C3.11597 3.636 3.04459 3.624 2.97322 3.624C2.77098 3.624 2.56875 3.732 2.46169 3.924L0.0824771 8.076C-0.0721714 8.34 -0.000795007 8.664 0.22523 8.844L2.7353 10.824C2.68771 11.208 2.65202 11.604 2.65202 12C2.65202 12.396 2.68771 12.792 2.7353 13.176L0.22523 15.156C-0.000795007 15.336 -0.0602754 15.66 0.0824771 15.924L2.46169 20.076C2.56875 20.268 2.77098 20.376 2.98511 20.376C3.05649 20.376 3.12786 20.364 3.18734 20.34L6.14946 19.14C6.76805 19.62 7.43423 20.016 8.15989 20.316L8.61194 23.496C8.64763 23.784 8.89745 24 9.19485 24H13.9533C14.2507 24 14.5005 23.784 14.5362 23.496L14.9882 20.316C15.7139 20.016 16.3801 19.608 16.9987 19.14L19.9608 20.34C20.0321 20.364 20.1035 20.376 20.1749 20.376C20.3771 20.376 20.5794 20.268 20.6864 20.076L23.0656 15.924C23.2084 15.66 23.1489 15.336 22.9229 15.156L20.4128 13.176ZM18.0574 11.124C18.105 11.496 18.1169 11.748 18.1169 12C18.1169 12.252 18.0931 12.516 18.0574 12.876L17.8909 14.232L18.9496 15.072L20.2344 16.08L19.4017 17.532L17.8909 16.92L16.6537 16.416L15.583 17.232C15.0715 17.616 14.5838 17.904 14.096 18.108L12.835 18.624L12.6447 19.98L12.4068 21.6H10.7413L10.325 18.624L9.06399 18.108C8.55246 17.892 8.07662 17.616 7.60078 17.256L6.51824 16.416L5.25726 16.932L3.74646 17.544L2.91374 16.092L4.19851 15.084L5.25726 14.244L5.09071 12.888C5.05502 12.516 5.03123 12.24 5.03123 12C5.03123 11.76 5.05502 11.484 5.09071 11.124L5.25726 9.768L4.19851 8.928L2.91374 7.92L3.74646 6.468L5.25726 7.08L6.49444 7.584L7.56509 6.768C8.07662 6.384 8.56436 6.096 9.0521 5.892L10.3131 5.376L10.5034 4.02L10.7413 2.4H12.3949L12.8112 5.376L14.0722 5.892C14.5838 6.108 15.0596 6.384 15.5354 6.744L16.618 7.584L17.879 7.068L19.3898 6.456L20.2225 7.908L18.9496 8.928L17.8909 9.768L18.0574 11.124ZM11.5741 7.2C8.94503 7.2 6.81564 9.348 6.81564 12C6.81564 14.652 8.94503 16.8 11.5741 16.8C14.2031 16.8 16.3325 14.652 16.3325 12C16.3325 9.348 14.2031 7.2 11.5741 7.2ZM11.5741 14.4C10.2655 14.4 9.19485 13.32 9.19485 12C9.19485 10.68 10.2655 9.6 11.5741 9.6C12.8826 9.6 13.9533 10.68 13.9533 12C13.9533 13.32 12.8826 14.4 11.5741 14.4Z",
});

const PlusIcon = createIcon({
  displayName: "PlusIcon",
  viewBox: "0 0 14 13",
  d: "M0.855469 8.17188V5.11328H5.66016V0.308594H8.74219V5.11328H13.5469V8.17188H8.74219V13H5.66016V8.17188H0.855469Z",
});

// Navbar component
export const NavBar: React.FC = () => {
  return (
    <Box padding={10} w={250}>
      <Flex
        alignItems="flex-start"
        justify="space-around"
        flexDirection="column"
      >
        <Popover>
          <PopoverTrigger>
            <Button
              marginBottom="5"
              height="9"
              width="85%"
              justifyContent="flex-start"
              bg="#FF5000"
              textColor="white"
            >
              <PlusIcon marginRight="2" />
              Create Form
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent w="350px">
              <PopoverArrow />
              <PopoverHeader>Select Form</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Button marginRight="2">Form #1</Button>
                <Button marginRight="2">Form #2</Button>
                <Button marginRight="2">Form #3</Button>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
        <StyleButton link="/">
          <OverViewIcon marginRight="2" />
          Overview
        </StyleButton>
        <StyleButton link="/todo">
          <ToDoIcon marginRight="2" />
          To do
        </StyleButton>
        <StyleButton link="/pending">
          <PendingIcon marginRight="2" />
          Pending
        </StyleButton>
        <StyleButton link="/completed">
          <CompletedIcon marginRight="2" />
          Completed
        </StyleButton>
        <Divider mt={"5"} mb={5} borderColor={"gray"} />
        <StyleButton link="/history">
          <HistoryIcon marginRight="2" />
          History
        </StyleButton>
        <StyleButton link="/settings">
          <SettingsIcon marginRight="2" />
          Settings
        </StyleButton>
      </Flex>
    </Box>
  );
};
