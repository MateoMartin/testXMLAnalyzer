# Test XML Analyzer

This tool analyzes two html files and gets a html element from the first file by an id given by parameter.  
Then looks in the second file for the element most similar to this element.
To do this, it calculates a score of similarity between the attributes of this element and those of the second file that have the same tag.  
All the attributes have the same weight for the score except the value of the tag. Then the elements are sorted by this score and the path of the most similar element is returned with a format like the following: 

	`html > body > div > div[1] > div > a.`

## How to run it

To run the tool you have to execute: 

	`node analyzer.js <input_origin_file_path> <input_other_sample_file_path> <id(optional)>`

-   <input_origin_file_path> - origin sample path to find the element with attribute id="make-everything-ok-button" and collect all the required information;
-   <input_other_sample_file_path" - path to diff-case HTML file to search a similar element;
-	"id"  is a optional attribute and it will default to "make-everything-ok-button" if not set.

## Samples Examples
Examples with input/output of samples:

1_  Input: `node analyzer.js samples/sample-0-origin.html samples/sample-1-evil-gemini.html`  
Output: `html > body > div > div > div[2] > div[0] > div > div[1] > a[1]`

2_ Input: `node analyzer.js samples/sample-0-origin.html samples/sample-2-container-and-clone.html`  
Output: `html > body > div > div > div[2] > div[0] > div > div[1] > div > a`

3_ Input: `node analyzer.js samples/sample-0-origin.html samples/sample-3-the-escape.html`  
Output: `html > body > div > div > div[2] > div[0] > div > div[2] > a`

4_ Input: `node analyzer.js samples/sample-0-origin.html samples/sample-4-the-mash.html`  
Output: `html > body > div > div > div[2] > div[0] > div > div[2] > a`