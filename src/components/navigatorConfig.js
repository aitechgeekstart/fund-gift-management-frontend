import { useAuth } from "@/hooks/use-auth";
import ArticleIcon from "@mui/icons-material/Article";
import { isEmpty } from "lodash";

const defaultNavigators = () => [
  {
    key: "GIFT_CAMPAIGNS",
    value: "Gift Management",
    to: `/auth/gift_campaigns`,
    icon: <ArticleIcon fontSize="small" sx={{ color: "#FFF" }} />,
    permissions: "no_permission",
  },
];

export default function NavigatorConfig() {
  const auth = useAuth();
  const getNavigators = () => {
    if (!auth) {
      return [];
    }
    const { can } = auth;
    let nextNavigator = defaultNavigators();
    // filter only my permissions
    nextNavigator = nextNavigator.filter((obj) => {
      if (obj.devOnly) {
        return (
          process.env.APP_ENV === "dev" ||
          process.env.APP_ENV === "devlocal" ||
          process.env.APP_ENV === "development"
        );
      }

      if (!isEmpty(obj.children)) {
        obj.children = obj.children.filter((cobj) => {
          return can(cobj.permissions);
        });
      }

      return can(obj.permissions);
    });
    return nextNavigator;
  };

  return { getNavigators };
}
