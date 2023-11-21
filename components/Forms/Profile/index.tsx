import React, { useEffect, useState } from "react";
import { background, Box, Textarea } from "@chakra-ui/react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { pinToPinata } from "../../../lib/pinata";
import { IPFSDataType } from "../../../hooks/usePinata";
const shajs = require("sha.js");
import { nearStore } from "../../../store/near";
import { ProfileType } from "../../../types/stores";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const ProfileSettingForm: React.FC = () => {
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [filePreview, setFilePreview] = useState<string>();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [is3d, setIs3d] = useState<boolean>();
  const [ipfsData, setIpfsData] = useState<IPFSDataType>({
    fileUrl: null,
    fileSize: null,
    urlSha256: null,
  });
  const [creating, setCreating] = useState<boolean>(false);
  const nearState = nearStore((state) => state);
  const [showTriggers, setShowTriggers] = useState<boolean>(false);
  const initialValues = {
    name: "",
    userName: "",
    bio: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    userName: Yup.string().required("User name is required"),
    bio: Yup.string().required("Bio is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const { touched, values, getFieldProps, isValid, errors } = formik;

  const handleSubmit = async () => {
    if (creating) return;
    if (!file && !nearState._3dUrl)
      return "Please select a profile image or use 3d avatar";
    setCreating(true);
    console.log("File: ", file);
    console.log("Username: ", formik.values.userName);
    let fileUrl: string = "";
    let fileUrlHash: string = "";
    if (!nearState._3dUrl && !is3d) {
      let returnedIpfsData = await pinToPinata(
        file,
        "PROFILE",
        formik.values.userName
      );
      fileUrl = `${process.env.NEXT_PUBLIC_IPFS_BASE_URL}/${returnedIpfsData.IpfsHash}`;
      console.log("File url: ", fileUrl);
      const fileSize = returnedIpfsData.PinSize;
      console.log("File size: ", fileSize);
      fileUrlHash = new shajs.sha256().update(fileUrl).digest("base64");
      console.log("Encrypted url: ", fileUrlHash);
      //is the set state really needed?
      setIpfsData((prevIpfs) => ({
        ...prevIpfs,
        fileUrl: fileUrl,
        fileSize: fileSize,
        urlSha256: fileUrlHash,
      }));
    } else {
      fileUrl = avatarUrl!;
      fileUrlHash = new shajs.sha256().update(avatarUrl).digest("base64");
    }
    const profileToMint = {
      title: "AERX ProfileNFT for " + formik.values.userName,
      username: formik.values.userName,
      description: formik.values.bio,
      media: fileUrl,
      media_hash: fileUrlHash,
      issued_at: new Date().toISOString(),
      extra: formik.values.name,
      //Todo: confirm if there will be extra from project management
    };
    // console.log('Profile to mint: ', profileToMint);
    // console.log('Ipfs data: ', returnedIpfsData);

    try {
      await nearState.pnftContract
        ?.mint_profile(
          {
            user_id: nearState.accountId,
            username: profileToMint.username,
            token_metadata: profileToMint,
          },
          "300000000000000",
          "10000000000000000000000"
        )
        .then((res) => {
          toast.success(
            `AERX profileNFT minted Successfully with username: '${profileToMint.username}'`
          );
          const returnedProfile: any = {
            user_id: res.owner_id,
            username: res.token_id,
            fullName: formik.values.name,
            aboutMe: formik.values.bio,
            profileImg: res.metadata.media,
          };
          nearState.setProfile(returnedProfile);
          console.log("Profile: ", returnedProfile);
          window.location.replace(`${window.location.origin}/flow`);
        });
    } catch (error) {
      setCreating(false);
      toast.error(`Unable to mint AERX profileNFT. Try again later`);
      console.error("Unable to mint AERX profileNFT: ", error);
    }
  };

  const uploadPhoto = () => {
    (document.getElementsByClassName("upload-photo")[0] as any).click();
  };

  function fileChange(event: any) {
    // alert("file changed")
    const file = event.target.files[0];
    if (file) {
      const filename = file?.name;
      var parts = filename.split(".");
      const fileType = parts[parts.length - 1];
      // setBody((prevBody: any) => {
      //     return {
      //         ...prevBody,
      //         media_extension: fileType,
      //     };
      // });
      setFilePreview(URL.createObjectURL(file));
      setFile(file);
      toast.success("Image selected");
    }
  }
  const render3dAsImage = (avatarUrl: string) => {
    const params = {
      model: `${avatarUrl}`,
      scene: "fullbody-portrait-v1-transparent",
      armature: "ArmatureTargetMale",
      blendShapes: {},
    };
    const http = new XMLHttpRequest();
    http.open("POST", "https://render.readyplayer.me/render");
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(params));
    http.onload = function () {
      const avatarPngUrl = JSON.parse(http.responseText).renders[0];
      console.log("png: ", avatarPngUrl);
      setAvatarUrl(avatarPngUrl);
      setFilePreview(avatarPngUrl);
      setIs3d(true);
    };
  };

  useEffect(() => {
    if (nearState._3dUrl != null) {
      (async () => {
        await render3dAsImage(nearState._3dUrl!);
      })();
    }
  }, []);

  return (
    <div className="px-6">
      <Toaster />
      <div className="flex gap-6 mt-4 w-ful">
        <div className="relative ">
          <div
            className="h-[409px] w-[245px] bg-[#0000004d] p-2"
            style={{
              background: `${
                !nearState._3dUrl
                  ? 'url("/assets/images/profile-avatar-cover.svg")'
                  : "#000"
                // : 'linear-gradient(180deg, #6054F0 0%, #332B8D 100%)'
              }`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20px",
              backgroundBlendMode: "overlay",
            }}
          >
            {/* {!nearState._3dUrl && (
              <div className="flex flex-col justify-between h-[50%] text-sm pt-4">
                <div className="flex justify-around">
                  <label className="text-white">Avatar</label>
                </div>

                <div
                  className="flex flex-col justify-around w-full cursor-pointer upload-trigger"
                  onClick={uploadPhoto}
                  onMouseEnter={() => setShowTriggers(true)}
                  style={{
                    zIndex: showTriggers ? 5 : 1,
                  }}
                >
                  <Image
                    src="/assets/icons/upload-icon.svg"
                    alt="profile-avatar"
                    width={40}
                    height={40}
                    className="cursor-pointer"
                  />
                  <label className="text-center text-white cursor-pointer">
                    Upload
                  </label>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={fileChange}
                    className="upload-photo"
                  />
                </div>

                <div
                  className="flex flex-col justify-around w-full cursor-pointer upload-trigger"
                  onMouseEnter={() => setShowTriggers(true)}
                  onClick={() => router.push("/create-avatar")}
                  style={{
                    zIndex: showTriggers ? 5 : 1,
                  }}
                >
                  <Image
                    src="/assets/icons/3d-account-icon.svg"
                    alt="profile-avatar"
                    width={40}
                    height={40}
                  />
                  <label className="text-center text-white">3D avatar</label>
                </div>
              </div>
            )} */}

            {filePreview && (
              <div className="flex flex-col justify-between h-[50%] text-sm pt-4">
                <div className="flex justify-around">
                  <label className="text-white">Avatar</label>
                </div>

                <div
                  className="flex flex-col justify-around w-full cursor-pointer upload-trigger"
                  onClick={uploadPhoto}
                  onMouseEnter={() => setShowTriggers(true)}
                  style={{
                    zIndex: showTriggers ? 5 : 1,
                  }}
                >
                  <Image
                    src="/assets/icons/upload-icon.svg"
                    alt="profile-avatar"
                    width={40}
                    height={40}
                    className="cursor-pointer"
                  />
                  <label className="text-center text-white cursor-pointer">
                    Upload
                  </label>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={fileChange}
                    className="upload-photo"
                  />
                </div>

                <div
                  className="flex flex-col justify-around w-full cursor-pointer upload-trigger"
                  onMouseEnter={() => setShowTriggers(true)}
                  onClick={() => router.push("/create-avatar")}
                  style={{
                    zIndex: showTriggers ? 5 : 1,
                  }}
                >
                  <Image
                    src="/assets/icons/3d-account-icon.svg"
                    alt="profile-avatar"
                    width={40}
                    height={40}
                  />
                  <label className="text-center text-white">3D avatar</label>
                </div>
              </div>
            )}

            {!nearState._3dUrl && (
              <div className="flex flex-col justify-between h-[50%] text-sm pt-4">
                <div className="flex justify-around">
                  <label className="text-white">Avatar</label>
                </div>

                <div
                  className="flex flex-col justify-around w-full cursor-pointer upload-trigger"
                  onClick={uploadPhoto}
                  onMouseEnter={() => setShowTriggers(true)}
                  style={{
                    zIndex: showTriggers ? 5 : 1,
                  }}
                >
                  <Image
                    src="/assets/icons/upload-icon.svg"
                    alt="profile-avatar"
                    width={40}
                    height={40}
                    className="cursor-pointer"
                  />
                  <label className="text-center text-white cursor-pointer">
                    Upload
                  </label>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={fileChange}
                    className="upload-photo"
                  />
                </div>

                <div
                  className="flex flex-col justify-around w-full cursor-pointer upload-trigger"
                  onMouseEnter={() => setShowTriggers(true)}
                  onClick={() => router.push("/create-avatar")}
                  style={{
                    zIndex: showTriggers ? 5 : 1,
                  }}
                >
                  <Image
                    src="/assets/icons/3d-account-icon.svg"
                    alt="profile-avatar"
                    width={40}
                    height={40}
                  />
                  <label className="text-center text-white">3D avatar</label>
                </div>
              </div>
            )}

            {nearState._3dUrl && (
              <div
                id="babylon-element"
                style={{ width: "100%", height: "100%", margin: "auto" }}
              ></div>
            )}
          </div>

          {/* display the file preview  */}
          <div
            className="absolute top-0"
            style={{
              zIndex: 3,
            }}
            onMouseEnter={() => setShowTriggers(true)}
            onMouseLeave={() => setShowTriggers(false)}
          >
            {filePreview && filePreview ? (
              <div>
                <Image
                  src={filePreview as string}
                  alt="profile-avatar"
                  width={245}
                  height={410}
                  className="rounded-2xl"
                  objectFit="cover"
                />
              </div>
            ) : (
              nearState._3dUrl && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width={245}
                  height={410}
                >
                  <Image
                    height="24px"
                    width="24px"
                    src="/resources/loader.gif"
                  />
                </Box>
              )
            )}
          </div>
        </div>
        <div className="w-[55%] ">
          <input
            type="text"
            placeholder="Full name"
            className="w-full px-4 py-3 text-sm text-white bg-black rounded-md focus:outline-none"
            {...getFieldProps("name")}
            name="name"
            style={touched.name && errors.name ? { borderColor: "red" } : {}}
          />
          <>
            {touched.name && errors.name && (
              <label className="text-sm text-red-500">{errors?.name}</label>
            )}
          </>
          <input
            type="text"
            placeholder="Username"
            className="mt-[1em] w-full text-sm  py-3 px-4 focus:outline-none bg-black rounded-md text-white"
            {...getFieldProps("userName")}
            name="userName"
            style={
              touched.userName && errors.userName ? { borderColor: "red" } : {}
            }
          />
          <>
            {touched.userName && errors.userName && (
              <label className="text-sm text-red-500">{errors?.userName}</label>
            )}
          </>

          <Textarea
            placeholder="About"
            style={{
              border: 0,
              backgroundColor: "black",
              marginTop: "1em",
              fontSize: "14px",
              color: "white",
              resize: "none",
            }}
            rows={14}
            {...getFieldProps("bio")}
            className={touched.bio && errors.bio ? "border-red-500" : ""}
            name="bio"
          />
          <>
            {touched.bio && errors.bio && (
              <label className="text-sm text-red-500">{errors?.bio}</label>
            )}
          </>
        </div>
      </div>
      <div className="flex justify-around w-full mt-4">
        <button
          disabled={
            !isValid || !touched.name || !touched.userName || !touched.bio
              ? // ||(file && filePreview)
                true
              : false
          }
          onClick={handleSubmit}
          className="text-white bg-purple p-2 rounded-[10px] w-[200px]"
          style={
            !isValid || !touched.name || !touched.userName || !touched.bio
              ? // ||  (file && nearState._3dUrl)
                { opacity: 0.5 }
              : { opacity: 1 }
          }
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettingForm;
