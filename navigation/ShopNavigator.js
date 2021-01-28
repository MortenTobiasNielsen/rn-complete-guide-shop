import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Platform } from "react-native";

import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import productsDetailScreen from "../screens/shop/ProductDetailScreen";
import Colors from "../constants/Colors";
import StandardFonts from "../constants/fonts";

const ProductsNavigator = createStackNavigator(
  {
    productsOverview: ProductsOverviewScreen,
    productDetail: productsDetailScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : "",
      },
      headerTitleStyle: {
        fontFamily: StandardFonts.openSansBold,
      },
      headerBackTitleStyle: {
        fontFamily: StandardFonts.openSans,
      },

      headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
    },
  }
);

export default createAppContainer(ProductsNavigator);
