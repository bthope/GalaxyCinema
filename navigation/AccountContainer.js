import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Setting from "../screens/Setting";

const stack = createNativeStackNavigator();
let navigation = useNavigation();

export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="Setting" component={Setting} options={{headerShown: false}}/>
      </stack.Navigator>
    </NavigationContainer>
  );
}


