import { setPostChargers } from "../store/slices/postChargesSlice";

const AWS = require("aws-sdk");
const filebase = new AWS.S3({
  endpoint: "https://s3.filebase.com",
  signatureVersion: "v4",
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

const initPostChargersList = (postId, chargerId, postOwner, isRepost) => {
  let aerx_charge;
  if (isRepost == true) {
    aerx_charge = {
      Bucket: "aerx-charges",
      Key: `aerx-Repost-${postId} chargers`,
      Body: `${chargerId}`,
      ContentType: "aerx-Repost chargers",
      Metadata: {
        postOwner: `${postOwner}`,
      },
    };
  } else {
    aerx_charge = {
      Bucket: "aerx-charges",
      Key: `aerx-NFTpost-${postId} chargers`,
      Body: `${chargerId}`,
      ContentType: "aerx-NFTpost chargers",
      Metadata: {
        postOwner: `${postOwner}`,
      },
    };
  }
  console.log("aerx charge ", aerx_charge);
  filebase.putObject(aerx_charge, (err, data) => {
    if (err) {
      console.log("Error! unable to upload charger for this post ", err.stack);
    } else {
      console.log("Charger uploaded successfully ", data);
    }
  });
};

const updatePostChargers = (postId, chargerId, postOwner, isRepost) => {
  if (isRepost == true) {
    const params = {
      Key: `aerx-Repost-${postId} chargers`,
      Bucket: "aerx-charges",
    };
    filebase.getObject(params, (err, data) => {
      if (err) {
        // console.error("Error chargers list does not exist for this post: ", err);
      } else {
        const chargers = Buffer.from(data.Body, "utf8").toString();
        const aerx_charge = {
          Bucket: "aerx-charges",
          Key: `aerx-Repost-${postId} chargers`,
          Body: `${chargers}` + "##" + `${chargerId}`,
          ContentType: "aerx-Repost chargers",
          Metadata: {
            postOwner: `${postOwner}`,
          },
        };
        filebase.putObject(aerx_charge, (err, data) => {
          if (err) {
            console.log(
              "Error! unable to upload charger for this post ",
              err.stack
            );
          } else {
            console.log("Charger uploaded successfully ", data);
          }
        });
      }
    });
  } else {
    const params = {
      Key: `aerx-NFTpost-${postId} chargers`,
      Bucket: "aerx-charges",
    };
    filebase.getObject(params, (err, data) => {
      if (err) {
        // console.error("Error chargers list does not exist for this post: ", err.stack);
      } else {
        const chargers = Buffer.from(data.Body, "utf8").toString();
        const aerx_charge = {
          Bucket: "aerx-charges",
          Key: `aerx-NFTpost-${postId} chargers`,
          Body: `${chargers}` + "##" + `${chargerId}`,
          ContentType: "aerx-NFTpost chargers",
          Metadata: {
            postOwner: `${postOwner}`,
          },
        };
        filebase.putObject(aerx_charge, (err, data) => {
          if (err) {
            console.log(
              "Error! unable to upload charger for this post ",
              err.stack
            );
          } else {
            console.log("Charger uploaded successfully ", data);
          }
        });
      }
    });
  }
};

const getPostChargers = (postId, isRepost, dispatch) => {
  if (isRepost == true) {
    const params = {
      Key: `aerx-Repost-${postId} chargers`,
      Bucket: "aerx-charges",
    };
    return filebase.getObject(params, (err, data) => {
      if (err) {
        // console.error("Error chargers list does not exist for this post: ", err.stack);
      } else {
        const chargers = Buffer.from(data.Body, "utf8").toString();
        dispatch(setPostChargers(postId, chargers));
        return chargers;
      }
    });
  } else {
    const params = {
      Key: `aerx-NFTpost-${postId} chargers`,
      Bucket: "aerx-charges",
    };
    return filebase.getObject(params, (err, data) => {
      if (err) {
        // console.error("Error chargers list does not exist for this post: ", err.stack);
      } else {
        const chargers = Buffer.from(data.Body, "utf8").toString();
        dispatch(setPostChargers({ post_id: postId, chargers }));
        // console.log("chargers: ", chargers);
        return chargers;
      }
    });
  }
};

export { initPostChargersList, updatePostChargers, getPostChargers };
