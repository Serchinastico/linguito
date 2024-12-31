import { Illustration } from "@app/core/components/Illustration";
import { t, Trans } from "@lingui/macro";
import { Center, Column } from "@madeja-studio/telar";
import { Text } from "react-native";

export const AppPurchasePrompt = () => {
  return (
    <Column>
      <Center style={tw`mt-8`}>
        <Illustration heightWindowRatio="1/3" name="settings" />
      </Center>

      <Text
        style={tw`h2 text-center mt-6`}
      >{t`Buy the app to get unlimited projects`}</Text>

      <Center style={tw`mt-4`}>
        <Trans>
          <Text style={tw`body text-center`}>
            <Text>
              Support us in this project and get the app with no limitations{" "}
            </Text>
            <Text style={tw`font-bold`}>forever</Text>
            <Text>.</Text>
          </Text>
        </Trans>
      </Center>
    </Column>
  );
};
