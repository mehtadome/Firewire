using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Text;
using System.IO;
using TMPro;


public class AzureOCR : MonoBehaviour
{
    string subscriptionKey = "";
    string endpoint = "";

    [Header("Image Input")]
    public TextMeshPro Info;
    public GameObject Window;

    public void StartOCR(string imagePath)
    {
        if (!File.Exists(imagePath))
        {
            Debug.LogError("Image file not found: " + imagePath);
            return;
        }

        byte[] imageBytes = File.ReadAllBytes(imagePath);
        StartCoroutine(SendImageForOCR(imageBytes, imagePath));
    }

    public IEnumerator SendImageForOCR(byte[] imageBytes, string imagePath)
    {
        UnityWebRequest www = UnityWebRequest.Put(endpoint, imageBytes);
        www.method = UnityWebRequest.kHttpVerbPOST;
        www.SetRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        www.SetRequestHeader("Content-Type", "application/octet-stream");

        yield return www.SendWebRequest();

        if (www.result == UnityWebRequest.Result.Success)
        {
            // Azure gives you an operation-location to poll for the result
            string operationLocation = www.GetResponseHeader("operation-location");
            Debug.Log("OCR request sent. Polling at: " + operationLocation);
            StartCoroutine(PollForResult(operationLocation, imagePath));
        }
        else
        {
            Debug.LogError("OCR request failed: " + www.error);
        }
    }

    IEnumerator PollForResult(string url, string imagePath)
    {
        bool done = false;

        while (!done)
        {
            yield return new WaitForSeconds(1f); // delay between polls

            using (UnityWebRequest request = UnityWebRequest.Get(url))
            {
                request.SetRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);

                yield return request.SendWebRequest();

                if (request.result == UnityWebRequest.Result.Success)
                {
                    string json = request.downloadHandler.text;

                    if (json.Contains("\"status\":\"succeeded\""))
                    {
                        Debug.Log("OCR complete:\n" + json);

                        string text = AzureOCRParser.ExtractTextBlock(json);
                        Debug.Log("Extracted Text:\n" + text);
                        Info.text = text;
                        Window.SetActive(true);
                        done = true;
                        File.Delete(imagePath);
                    }
                    else
                    {
                        Debug.Log("Waiting for OCR result...");
                    }
                }
                else
                {
                    Debug.LogError("Polling failed: " + request.error);
                    done = true; // exit loop on error
                }
            }
        }
    }

}
