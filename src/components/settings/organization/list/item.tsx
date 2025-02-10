import {
  Avatar,
  Button,
  Dialog,
  List,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Tables } from "@/src/types/supabase";
import { useState } from "react";
import { useDeleteOrganizationMember } from "@/src/hooks/org-members/delete";
import { useAppDispatch } from "@/src/store/hooks";
import {
  deleteOrganizationMember,
  updateOrganizationMember,
} from "@/src/store/features/organization-members.slice";
import { useUpdateOrganizationMember } from "@/src/hooks/org-members/update";

type Member = Tables<"organization_members"> & {
  profiles: Tables<"profiles">;
};

interface Props {
  item: Member;
}

export function MemberListItem({ item }: Props) {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation("settings", {
    keyPrefix: "organization.join-requests",
  });

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const { mutate: reject, isPending: rejectIsPending } =
    useDeleteOrganizationMember(() => {
      dispatch(deleteOrganizationMember(item.id));
      setIsDialogVisible(false);
    });

  const { mutate: accept, isPending: acceptIsPending } =
    useUpdateOrganizationMember(() => {
      dispatch(
        updateOrganizationMember({
          id: item.id,
          changes: { is_accepted: true },
        }),
      );
      setIsDialogVisible(false);
    });

  return (
    <>
      <List.Item
        title={
          item.profiles.first_name && item.profiles.last_name
            ? `${item.profiles.first_name} ${item.profiles.last_name}`
            : t("unknown-member-name")
        }
        description={item.profiles.email}
        left={({ style }) => (
          <Avatar.Icon
            style={style}
            color={colors.surface}
            icon="account"
            size={32}
          />
        )}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
        onPress={() => setIsDialogVisible(true)}
      />

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => {}}>
          <Dialog.Icon icon="account-multiple-plus" />
          <Dialog.Title>{t("dialog-title")}</Dialog.Title>
          <Dialog.Content>
            <Text>{t("dialog-description")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => reject(item.id)}
              loading={rejectIsPending}
              disabled={rejectIsPending || acceptIsPending}
            >
              {t("reject")}
            </Button>
            <Button
              onPress={() =>
                accept({ id: item.id, role: item.role, is_accepted: true })
              }
              loading={acceptIsPending}
              disabled={rejectIsPending || acceptIsPending}
            >
              {t("accept")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
