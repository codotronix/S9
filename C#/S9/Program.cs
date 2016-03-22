using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace S9_CSharp
{
    class Program
    {
        static void Main(string[] args)
        {            
            var source =  File.ReadAllText("test_SrcCode.txt");

            S9 s9Instace = S9.getS9(source);
            s9Instace.init();

            //Wait for User to see the output...
            Console.ReadLine();
        }
    }
}
