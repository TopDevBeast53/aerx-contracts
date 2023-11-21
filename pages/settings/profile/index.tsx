import React, { useEffect, useState } from "react";
import ProfileSettingForm from "../../../components/Forms/Profile";
import { useRouter } from "next/router";
import { nearStore } from "../../../store/near";
import { Box, Image } from "@chakra-ui/react";

const ProfileSettings: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const state: any = nearStore((state) => state);

  const checkUser = async () => {
    if (state.pnftContract) {
      const isUserRegistered = await state.pnftContract?.has_registered({
        user_id: state.accountId,
      });

      if (!isUserRegistered) {
        setIsLoading(false);
      } else {
        router.push("/flow");
      }
    }
  };

  useEffect(() => {
    checkUser();
  }, [state.accountId, state.pnftContract]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black poppins">
      {!isLoading && (
        <div className="w-[45%] h-[max-content] bg-black-dark rounded-[20px] py-[30px] px-[20px] ">
          <div className="flex justify-around w-full">
            <Image
              src="/assets/images/ae-pass.svg"
              alt="ae-pass"
              width={50}
              height={50}
            />
          </div>
          <ProfileSettingForm />
        </div>
      )}
      <div>
        {isLoading && (
          <Box>
            <Image height="24px" width="24px" src="/resources/loader.gif" />
          </Box>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
