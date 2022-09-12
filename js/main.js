// JavaScript Document
var xhr=new XMLHttpRequest();

xhr.open('GET','../data/experience.json',true);
xhr.responseText='text';

xhr.onload=function(){
    if(xhr.status===200){
        var myStuff=JSON.parse(xhr.responseText);
        console.log(myStuff.certificates);
        var skills={};
        skillList=[];
        workList=[];
        myStuff.certificates.forEach(cert=>{
            //create cert block for skills
            let certData={
                "source":cert.source,
                "title":cert.title,
                "url":cert.url
            };
            //get list of skills
            //calc distinct skills
            let skillTime=(cert.hours*(cert.distinctSkillPct/100))/cert.distinctSkills.length;
            cert.distinctSkills.forEach(skill=>{
                const skillIndex=skillList.findIndex(elem=>{
                    return elem.name===skill;
                });
                if(skillIndex>-1){
                    skillList[skillIndex].hours+=skillTime;
                    skillList[skillIndex].certificates.push(certData);
                }else{
                    let dataBlock={
                        "name":skill,
                        "hours":skillTime,
                        "certificates":[certData],
                        "work":[],
                        "projects":[],
                        "courses":[]
                    };
                    skillList.push(dataBlock);
                }
            });
        });
        console.log(skillList);
    }
};

xhr.send();

