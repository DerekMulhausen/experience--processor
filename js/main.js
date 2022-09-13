// JavaScript Document
var xhr=new XMLHttpRequest();

xhr.open('GET','../data/experience.json',true);
xhr.responseText='text';

xhr.onload=function(){
    if(xhr.status===200){
        var Experience=JSON.parse(xhr.responseText);
        console.log(Experience.certificates);
        var skills={};
        skillList=[];
        workList=[];
        Experience.certificates.forEach(cert=>{
            //create cert block for skills
            let certData={
                "id":cert.id,
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
            if(concurrentSkills.length>0){
                skillTime=((100-cert.distinctSillPct)/100)*cert.hours;
                cert.concurrentSkills.forEach(skill=>{
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
            }
        });
        Experience.projects.forEach(proj=>{
            let projData={
                "id":proj.id,
                "title": proj.title,
                "desc":proj.desc,
                "type":proj.type,
                "workid":proj.workid,
                "completed":proj.completed,
                "repo":proj.repo,
                
            };
        });
        console.log(skillList);
    }
};
function updateSkills(skillList, sourceBlock, skillBlock)

xhr.send();

