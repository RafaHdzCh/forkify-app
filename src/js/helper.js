import { TIMEOUT_SECONDS } from "./config";

//Useful functions that can be used anywhere in our project 

//Sets a timer before displaying an error to the user
function Timeout(seconds) 
{
  return new Promise(function (_, reject) 
  {
    setTimeout(function()
    {
      reject(new Error(`Request took too long! Timeout after ${seconds} second(s)`));
    }, seconds * 1000);
  });
};

//Obtains the data from a URL
export async function GetJSON(url)
{
    try
    {
        const response = await Promise.race([fetch(`${url}`),Timeout(TIMEOUT_SECONDS)]);
        const data = await response.json();
        if(!response.ok) throw new Error(`${data.message} Status: ${response.status}`);
        return data;
    }
    catch(error)
    {
        throw error;
    };
}

export async function AJAX(url, uploadData = undefined) 
{
  try 
  {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPro, Timeout(TIMEOUT_SECONDS)]);
    const data = await response.json();

    if (!response.ok) 
    {
      throw new Error(`${data.message} (${response.status})`);
    }
    return data;
  } 
  catch (error) 
  {
    throw error;
  }
};