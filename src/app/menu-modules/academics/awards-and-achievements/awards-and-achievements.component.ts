import { Component, OnInit } from "@angular/core";
import colorScheme from "src/app/interfaces/ColorScheme";
import { ThemeChangerService } from "src/app/services/theme-changer.service";
import { HttpClient } from "@angular/common/http";
import { awards } from "../../../models/awards";
import { AcademicsService } from "../academics.service";
@Component({
  selector: "app-awards-and-achievements",
  templateUrl: "./awards-and-achievements.component.html",
  styleUrls: ["./awards-and-achievements.component.css"],
  providers: [AcademicsService],
})
export class AwardsAndAchievementsComponent implements OnInit {
  theme: colorScheme;
  dtOptions: any = {};
  Awards: awards[];
  dataURL = "http://35.154.255.25:8000/awards-achievements/";

  constructor(
    private themeChanger: ThemeChangerService,
    private httpclient: HttpClient
  ) {}

  ngOnInit(): void {
    this.themeChanger.subscribeToTheme().subscribe((currentTheme) => {
      this.theme = currentTheme;
    });

    this.dtOptions = {
      paging: true,
      ordering: true,
      info: true,
      responsive: true,
    };

    this.httpclient.get(this.dataURL).subscribe((result2: awards[]) => {
      this.Awards = result2;
    });
  }

  dept: any = "";
  year: any = "";
  table_filter(event) {
    this.Awards = null;
    let years = ["All Years", "2016", "2017", "2018"];

    if (years.includes(event.target.value)) this.year = event.target.value;
    else this.dept = event.target.value;
    let a = this.dept;
    let b = this.year;

    if (
      (this.dept == "All Departments" && this.year == "All Years") ||
      (this.dept == "All Departments" && this.year == "") ||
      (this.dept == "" && this.year == "All Years")
    ) {
      this.dept = "";
      this.year = "";
      this.httpclient.get(this.dataURL).subscribe((result3: awards[]) => {
        this.Awards = result3;
      });
    }
    if (
      (this.dept != "" && this.year == "") ||
      (this.dept != "" && this.year == "All Years")
    ) {
      this.year = "";
      this.httpclient.get(this.dataURL).subscribe((result3: awards[]) => {
        this.Awards = result3.filter(function (d) {
          return d.department == a;
        });
      });
    }
    if (
      (this.dept == "" && this.year != "") ||
      (this.dept == "All Departments" && this.year != "")
    ) {
      this.dept = "";
      this.httpclient.get(this.dataURL).subscribe((result3: awards[]) => {
        this.Awards = result3.filter(function (d) {
          return d.date_year == b;
        });
      });
    }
    if (this.dept != "" && this.year != "") {
      this.httpclient.get(this.dataURL).subscribe((result3: awards[]) => {
        this.Awards = result3.filter(function (d) {
          return d.department == a && d.date_year == b;
        });
      });
    }
  }
}
