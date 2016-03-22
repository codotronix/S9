using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace S9_CSharp
{
    class S9
    {
        static S9 s9Instance = null;
        String source = "";
        List<UserVar> allUserVars = new List<UserVar>();

        //private constructor
        private S9 (String src) {
            this.source = src;
        }

        //I want atmost 1 instance of this class to be running at any time
        public static S9 getS9(String src) {
            if (S9.s9Instance == null) {
                S9.s9Instance = new S9(src);
            }
            return S9.s9Instance;
        }

        public void init() {
            //Console.WriteLine(this.source);
            extractStrings();

            Console.WriteLine(source);

            Console.WriteLine(allUserVars[2].value);
            
        }

        void extractStrings()
        {
            // modifiedSource = "";
            StringBuilder modifiedSource = new StringBuilder();
            var doubleQuoteOpen = false;
            var singleQuoteOpen = false;
            var stringVarNum = 0;
            StringBuilder stringVarValue = new StringBuilder();
             
            var prevChar = 'x';

            foreach (var i in source) 
            {            
                //when a double " is opening a quote
                if (i == '"' && prevChar != '\\' && !singleQuoteOpen) {              
                    if (!doubleQuoteOpen) {
                        doubleQuoteOpen = true;
                        stringVarNum++;
                    } else {
                        doubleQuoteOpen = false;
                        var varName = "____stringVar_____" + stringVarNum;
                        var stringVar = new UserVar();
                        stringVar.name = varName;
                        stringVar.value = stringVarValue.ToString();
                        stringVar.type = "txt";
                        allUserVars.Add(stringVar);
                        stringVarValue.Clear();
                        modifiedSource.Append(" " + varName + " "); 
                    }                
                } 
                else if (i == '\'' && prevChar != '\\' && !doubleQuoteOpen) {                
                    if (!singleQuoteOpen) {
                        singleQuoteOpen = true;
                        stringVarNum++;
                    } else {
                        singleQuoteOpen = false;
                        var varName = "____stringVar_____" + stringVarNum;
                        var stringVar = new UserVar();
                        stringVar.name = varName;
                        stringVar.value = stringVarValue.ToString();
                        stringVar.type = "txt";
                        allUserVars.Add(stringVar);
                        stringVarValue.Clear();
                        modifiedSource.Append(" " + varName + " ");
                    }                
                } 
                else {
                    if (doubleQuoteOpen || singleQuoteOpen) {
                        stringVarValue.Append(i);
                    } else {
                        modifiedSource.Append(i);
                    }
                }
                prevChar = i;
            }

            source = modifiedSource.ToString();
        }
    }
}
