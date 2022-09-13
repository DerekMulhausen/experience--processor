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
            skillList=updateSkills(skillList, certData, cert.distinctSkills, 'certificates', skillTime);
            // cert.distinctSkills.forEach(skill=>{
            //     const skillIndex=skillList.findIndex(elem=>{
            //         return elem.name===skill;
            //     });
            //     if(skillIndex>-1){
            //         skillList[skillIndex].hours+=skillTime;
            //         skillList[skillIndex].certificates.push(certData);
            //     }else{
            //         let dataBlock={
            //             "name":skill,
            //             "hours":skillTime,
            //             "certificates":[certData],
            //             "work":[],
            //             "projects":[],
            //             "courses":[]
            //         };
            //         skillList.push(dataBlock);
            //     }
            // });
            if(cert.concurrentSkills.length>0){
                skillTime=((100-cert.distinctSillPct)/100)*cert.hours;
                skillList=updateSkills(skillList, certData, cert.concurrentSkills, 'certificates', skillTime);
                // cert.concurrentSkills.forEach(skill=>{
                //     const skillIndex=skillList.findIndex(elem=>{
                //         return elem.name===skill;
                //     });
                //     if(skillIndex>-1){
                //         skillList[skillIndex].hours+=skillTime;
                //         skillList[skillIndex].certificates.push(certData);
                //     }else{
                //         let dataBlock={
                //             "name":skill,
                //             "hours":skillTime,
                //             "certificates":[certData],
                //             "work":[],
                //             "projects":[],
                //             "courses":[]
                //         };
                //         skillList.push(dataBlock);
                //     }
                // });
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
            const skillTime=proj.hours/proj.skills.length;
            skillList=updateSkills(skillList, projData, proj.skills, 'projects', skillTime, true);
            if(proj.workid>0){
                const workIndex=workList.findIndex(elem=>{
                    return elem.id===projData.workid;
                });
                if(workIndex>-1){
                    workList[workIndex].projectHours+=proj.hours;
                }else{
                    workList.push({
                        "id":proj.workid,
                        "projectHours":proj.hours
                    });
                }
            }
        });
        Experience.work.forEach(work=>{
            let workData={
                "id":work.id,
                "company":work.company,
                "title":work.title,
                "start":work.start,
                "end":work.end
            };
            let dateParse=split(work.start,'-');
            const dateStart=new Date(dateParse[0],dateParse[1]-1, dateParse[2]);
            dateParse=split(work.end,'-');
            const dateEnd=new Date(dateParse[0],dateParse[1]-1, dateParse[2]);
            const timeDiff=dateEnd.getTime()-dateStart.getTime();
            const dayDiff=timeDiff/(1000*3600*24);
            const workHours=dayDiff*5/7*8;

            let workTime;
            const workIndex=workList.findIndex(elem=>{
                return elem.id===work.id;
            });
            if(workIndex>-1){
                workTime=workHours-workList[workIndex].hours;
            }else{
                workTime=workHours;
            }
            if(work.distinctSkills.length>0){
                const skillTime=(work.hours*(work.distinctSkillPct/100))/work.distinctSkills.length;
                skillList=updateSkills(skillList, workData, work.distinctSkills, 'work', skillTime);
            }
            if(work.concurrentSkills.length>0){
                const skillTime=((100-work.distinctSillPct)/100)*work.hours;
                skillList=updateSkills(skillList, workData, work.concurrentSkills, 'work', skillTime);            
            }

        });
        console.log(skillList);
        console.log(workList);
    }
};
xhr.send();
function updateSkills(skillList, sourceBlock, skillBlock, sourceType, skillTime){
    skillBlock.forEach(skill=>{
        const skillIndex=skillList.findIndex(elem=>{
            return elem.name===skill;
        });
        if(skillIndex>-1){
            skillList[skillIndex].hours+=skillTime;
            skillList[skillIndex][sourceType].push(sourceBlock);
        }else{
            let dataBlock={
                "name":skill,
                "hours":skillTime,
                "certificates":[],
                "work":[],
                "projects":[],
                "courses":[]
            };
            dataBlock[sourceType].push(sourceBlock);
            skillList.push(dataBlock);
        }
    });
    return skillList;
}



