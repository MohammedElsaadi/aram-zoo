import { useEffect, useState } from "react";

export interface Champion {
    id: string;
    name: string;
    title: string;
    imageUrl: string;
  }
  
function useChampInfo() {
    const [champions, setChampions] = useState<Champion[]>([]);
    const [loading, setLoading] = useState(true);
    const [version, setVersion] = useState<string>("");
  
    useEffect(() => {
      async function fetchChampions() {
        try {
          const versionRes = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
          const versions = await versionRes.json();
          const latestVersion = versions[0];
          setVersion(latestVersion);
  
          const champRes = await fetch(
            `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`
          );
          const champData = await champRes.json();
  
          const champList = Object.values(champData.data).map((champ: any) => ({
            id: champ.id,
            name: champ.name,
            title: champ.title,
            imageUrl: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${champ.image.full}`
          }));
  
          setChampions(champList);
        } catch (err) {
          console.error("Failed to fetch champion data", err);
        } finally {
          setLoading(false);
        }
      }
  
      fetchChampions();
    }, []);
  
    return { champions, loading, version };
  }

  export default useChampInfo;
  