import { useMutation } from "@tanstack/react-query";
import api from "../../libs/axios";
import type { MutationConfig } from "../../libs/query";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type PayLoadType = {
    // taken_subject: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & any;

const update = async (payload: PayLoadType) => {
    // const { taken_subject, req } = payload;
    const dataClone = { ...payload };
    delete dataClone.taken_subject;
    const { data } = await api.post(
        `/survey/update?taken_subject${payload.taken_subject}`,
        dataClone
    );
    return data;
};

type UpdateType = {
    mutationConfig?: MutationConfig<typeof update>;
};

export const useUpdateSurveyPro = ({ mutationConfig }: UpdateType) => {
    return useMutation({
        ...mutationConfig,
        mutationFn: update,
    });
};
