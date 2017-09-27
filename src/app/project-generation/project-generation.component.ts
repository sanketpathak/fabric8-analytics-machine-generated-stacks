import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'project-generation',
    templateUrl: './project-generation.component.html',
    styleUrls: ['./project-generation.component.scss']
})

export class ProjectGenerationComponent implements OnInit {
    public header: string = 'Generate your project stack';
    public stack: any = {};
    public manifests: Array<string> = [];
    public currentFrameworks: Array<any> = [];
    public currentVersions: Array<any> = [];
    public frameworkStructure: any;
    public pickedSuggestions: Array<string> = [];
    public packs: any = {
        maven: {
            name: 'maven',
            displayName: 'Maven',
            options: [{
                name: 'group',
                displayName: 'Group',
            }, {
                name: 'artifactId',
                displayName: 'Artifact Id'
            }, {
                name: 'groupVersion',
                displayName: 'Project Version'
            }],
            frameworks: [{
                name: 'springboot',
                displayName: 'Spring Boot',
                versions: ['1.2.3']
            }, {
                name: 'vertx',
                displayName: 'Vert.x',
                versions: ['1.2.4']
            }, {
                name: 'wildfly',
                displayName: 'Wild Fly',
                versions: ['1.2.5']
            }]
        },
        node: {
            name: 'node',
            displayName: 'Node',
            frameworks: []
        },
        python: {
            name: 'python',
            displayName: 'Python',
            frameworks: [{
                name: 'django',
                displayName: 'Django',
                versions: ['1.2.3']
            }]
        }
    };

    public onManifestChange(): void {
        console.log(this.stack.ecosystem);
        this.currentFrameworks = this.packs[this.stack.ecosystem].frameworks;
        if (this.currentFrameworks && this.currentFrameworks.length > 0) {
            this.stack['framework'] = this.currentFrameworks[0].name;
            this.onFrameworkChange();
        } else {
            this.currentVersions = [];
        }
    }

    public onFrameworkChange(): void {
        console.log(this.stack.framework);
        this.frameworkStructure = this.currentFrameworks.filter(framework => framework.name === this.stack.framework);
        this.currentVersions = [];
        if (this.frameworkStructure) {
            this.currentVersions = this.frameworkStructure[0].versions;
            if (this.currentVersions && this.currentVersions.length > 0) {
                this.stack['version'] = this.currentVersions[0];
            }
        }
    }

    public onVersionChange(): void {
        console.log(this.stack.version);
    }

    ngOnInit(): void {
        this.manifests = Object.keys(this.packs);
        debugger;
        let manifest: string = this.manifests[0];
        this.stack['ecosystem'] = manifest;
        this.stack['framework'] = null;
        this.stack['version'] = null;
        this.onManifestChange();
        if (this.packs[manifest].frameworks && this.packs[manifest].frameworks.length > 0) {
            this.stack['framework'] = this.packs[manifest].frameworks[0].name;
            this.onFrameworkChange();
        }
    }

    public handleSearch(result: any): void {
        console.log(result);
        if (result) {
            let suggestion: string = result.suggestion;
            if (result.status === 'added') {
                this.pickedSuggestions.push(suggestion);
            } else if (result.status === 'removed') {
                let index: number = this.pickedSuggestions.indexOf(suggestion);
                if (index !== -1) {
                    this.pickedSuggestions.splice(index, 1);
                }
            }
        }
    }
}
